import { Status } from "src/constants";
import { connectDB } from "src/data-source";
import { URICapture } from "@website-capture/core/entity/URICapture";
import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Bucket } from "sst/node/bucket";

type EventPayload = {
  captureId: string;
};

const s3Client = new S3Client({});

// handler
export const handler = ApiHandler(async (event: any) => {
  // TODO: handle delete image here
  const POSTGRES_URL = Config.POSTGRES_URL;
  // connect db
  await connectDB(POSTGRES_URL);

  const { captureId }: EventPayload = event;
  // find capture by key
  const capture = await URICapture.findOneBy({
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
