import {
  StackContext,
  Api,
  Bucket,
  Queue,
  StaticSite,
  Config,
  Cognito,
  Function,
} from "sst/constructs";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { CfnScheduleGroup } from "aws-cdk-lib/aws-scheduler";

import * as lambda from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";

export function API({ stack, app }: StackContext) {
  // Remove all resources when non-prod stages are removed
  app.setDefaultRemovalPolicy("destroy");

  // Create User Pool
  const POSTGRES_URL = new Config.Secret(stack, "POSTGRES_URL");

  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
    triggers: {
      postConfirmation:
        "packages/functions/src/triggers/postConfirmation.handler",
    },
  });

  auth.bindForTriggers([POSTGRES_URL]);

  const layerChromium = new lambda.LayerVersion(stack, "chromiumLayers", {
    code: lambda.Code.fromAsset("layers/chromium"),
  });

  // new s3
  const bucket = new Bucket(stack, "sourceBucket", {});

  // TODO: add handler for dead letter
  const deadLetterQueue = new Queue(stack, "MyDLQ");

  // Create an IAM role
  const roleExecuteFunction = new Role(stack, "ApiRole", {
    assumedBy: new ServicePrincipal("scheduler.amazonaws.com"),
    managedPolicies: [
      {
        managedPolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaRole",
      },
    ],
  });

  // group for scheduler
  const cfnScheduleGroup = new CfnScheduleGroup(
    stack,
    "CaptureCfnScheduleGroup",
    {
      name: `CaptureCfnScheduleGroup-${stack.stage}`,
    }
  );

  // new function for EventBridge scheduler
  const imageCleaner = new Function(stack, "imageCollector", {
    handler: "packages/functions/src/triggers/imageCleaner.handler",
    bind: [POSTGRES_URL, bucket],
  });

  // new queue
  const queue = new Queue(stack, "queue", {
    consumer: {
      function: {
        handler: "packages/functions/src/consumer.handler",
        bind: [POSTGRES_URL, bucket],
        layers: [layerChromium],
        nodejs: {
          esbuild: {
            external: ["@sparticuz/chromium"],
          },
        },
        timeout: 40,
        runtime: "nodejs18.x",
        environment: {
          TARGET_ARN: imageCleaner.functionArn,
          TARGET_ROLE_ARN: roleExecuteFunction.roleArn,
          GROUP_NAME: cfnScheduleGroup.name || "CaptureCfnScheduleGroup",
        },
        permissions: ["scheduler:CreateSchedule", "iam:PassRole"],
      },
      // cdk for function
      cdk: {
        eventSource: {
          reportBatchItemFailures: true,
        },
      },
    },
    cdk: {
      queue: {
        visibilityTimeout: Duration.seconds(40),
        deadLetterQueue: {
          maxReceiveCount: 3,
          queue: deadLetterQueue.cdk.queue,
        },
      },
    },
  });

  // function to handle recurring capture
  const recurringCapture = new Function(stack, "recurringCapture", {
    handler: "packages/functions/src/triggers/recurringHandler.handler",
    bind: [POSTGRES_URL, bucket, queue],
  });

  const api = new Api(stack, "api", {
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },
    defaults: {
      function: {
        bind: [bucket, queue, POSTGRES_URL],
        runtime: "nodejs18.x",
        memorySize: 1024 * 2,
        environment: {
          TARGET_ARN: recurringCapture.functionArn,
          TARGET_ROLE_ARN: roleExecuteFunction.roleArn,
          GROUP_NAME: cfnScheduleGroup.name || "",
        },
        permissions: ["scheduler:CreateSchedule", "scheduler:UpdateSchedule", "iam:PassRole"],
      },
      authorizer: "jwt",
    },
    routes: {
      "POST /capture": "packages/functions/src/api/capture/post.handler",
      "GET /capture": "packages/functions/src/api/capture/getAll.handler",
      "GET /capture/{id}": "packages/functions/src/api/capture/get.handler",
      // recurring-capture
      "POST /recurring-capture":
        "packages/functions/src/api/recurringCapture/post.handler",
      "GET /recurring-capture":
        "packages/functions/src/api/recurringCapture/list.handler",
      "GET /recurring-capture/{id}":
        "packages/functions/src/api/recurringCapture/get.handler",
      "PUT /recurring-capture":
        "packages/functions/src/api/recurringCapture/put.handler",
      // test
      "POST /test/{id}": "packages/functions/src/test.handler",
    },
  });

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_APP_API_URL: api.url,
      VITE_APP_REGION: app.region,
      VITE_APP_USER_POOL_ID: auth.userPoolId,
      VITE_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    Bucket: bucket.bucketName,
    Web: web.url,
    Queue: queue.queueName,
    DeadLetterQueue: deadLetterQueue.queueName,
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
    imageCleanerArn: imageCleaner.functionArn,
    imageCleanerArnRoleArn: roleExecuteFunction.roleArn,
    scheduleGroup: cfnScheduleGroup.name,
  });

  return {
    api,
    bucket,
  };
}
