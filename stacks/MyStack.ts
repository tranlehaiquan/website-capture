import {
  StackContext,
  Api,
  Bucket,
  Queue,
  StaticSite,
  Config,
} from "sst/constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export function API({ stack }: StackContext) {
  const layerChromium = new lambda.LayerVersion(stack, "chromiumLayers", {
    code: lambda.Code.fromAsset("layers/chromium"),
  });

  const POSTGRES_URL = new Config.Secret(stack, "POSTGRES_URL");
  // new s3
  const bucket = new Bucket(stack, "sourceBucket", {});

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
        timeout: 120,
      },
    },
  });

  const api = new Api(stack, "api", {
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
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    Bucket: bucket.bucketName,
    Web: web.url,
    Queue: queue.queueName,
  });
}
