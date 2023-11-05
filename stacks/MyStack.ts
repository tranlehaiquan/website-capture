import {
  StackContext,
  Api,
  Bucket,
  Queue,
  StaticSite,
  Config,
  Cognito,
} from "sst/constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export function API({ stack, app }: StackContext) {// Create User Pool
  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });

  const layerChromium = new lambda.LayerVersion(stack, "chromiumLayers", {
    code: lambda.Code.fromAsset("layers/chromium"),
  });

  const POSTGRES_URL = new Config.Secret(stack, "POSTGRES_URL");
  // new s3
  const bucket = new Bucket(stack, "sourceBucket", {});

  const deadLetterQueue = new Queue(stack, "MyDLQ");

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
        runtime: "nodejs18.x",
      },
      // cdk for function
      cdk: {
        eventSource: {
          reportBatchItemFailures: true,
        }
      }
    },
    // cdk for queue
    cdk: {
      queue: {
        deadLetterQueue: {
          maxReceiveCount: 3,
          queue: deadLetterQueue.cdk.queue,
        },
      },
    },
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
        nodejs: {
          esbuild: {
            external: ["@sparticuz/chromium"],
          },
        },
        layers: [layerChromium],
        runtime: 'nodejs18.x',
        timeout: 120,
        memorySize: 1024 * 2,
      },
      authorizer: "jwt",
    },
    routes: {
      "POST /capture": "packages/functions/src/capture/post.handler",
      "GET /capture/{id}": "packages/functions/src/capture/get.handler",
      "POST /test": "packages/functions/src/test.handler",
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
  });

  return {
    api,
    bucket,
  }
}
