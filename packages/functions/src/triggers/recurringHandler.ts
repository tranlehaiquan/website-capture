import { Status } from "@website-capture/core/constants";
import { Capture } from "@website-capture/core/entity/Capture";
import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Bucket } from "sst/node/bucket";
import middy from "@middy/core";
import { connectDatabase } from "@website-capture/core/middlewares";

type EventPayload = {
  captureId: string;
};

const s3Client = new S3Client({});

// handler
const imageCleanerHandler = ApiHandler(async (event: any) => {
  console.log(event);

  return event;
});

export const handler = middy(imageCleanerHandler).use([
  connectDatabase(Config.POSTGRES_URL),
]);
