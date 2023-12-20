import { Status } from "shared";
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
  const { captureId }: EventPayload = event;
  // find capture by key
  const capture = await Capture.findOneBy({
    id: captureId,
  });

  if (!capture) {
    throw new Error("Capture not found");
  }

  capture.status = Status.deleted;

  // delete image from s3
  const command = new DeleteObjectCommand({
    Bucket: Bucket.sourceBucket.bucketName,
    Key: capture.imagePath,
  });

  await s3Client.send(command);
  await capture.save();

  return event;
});

export const handler = middy(imageCleanerHandler).use([
  connectDatabase(Config.POSTGRES_URL),
]);
