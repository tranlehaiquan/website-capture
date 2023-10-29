import { Bucket } from "sst/node/bucket";

import { screenshot } from "@website-capture/core/puppeteerWorker";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { ApiHandler } from "sst/node/api";

// pre-signed
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({});

export const handler = ApiHandler(async (_evt) => {
  // get params
  const params = _evt.queryStringParameters || {};
  const url = params.url;

  if (!url) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Cant not found!",
      }),
    };
  }

  const buffer = await screenshot(url);

  // random key
  const uid = Math.round(Math.random() * 100);
  const key = `${uid}.jpeg`;

  // Upload the image to the S3 bucket
  await s3Client.send(
    new PutObjectCommand({
      Bucket: Bucket.sourceBucket.bucketName,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
    })
  );

  // get pre-signed url
  const urlResult = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: Bucket.sourceBucket.bucketName,
      Key: key,
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      urlResult,
    }),
  };
});
