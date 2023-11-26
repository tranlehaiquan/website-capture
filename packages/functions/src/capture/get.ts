import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";
import { connectDB } from "../data-source";
import { URICapture } from "@website-capture/core/entity/URICapture";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Bucket } from "sst/node/bucket";

const s3Client = new S3Client({});

export const handler = ApiHandler(async (_evt) => {
  // get id from path /capture/{id}
  const id = _evt.pathParameters?.id;

  // get config
  const POSTGRES_URL = Config.POSTGRES_URL;
  // connect db
  await connectDB(POSTGRES_URL);

  // get url params
  const params = _evt.queryStringParameters || {};
  const captureId = id || params.id;
  const preSigned = params.preSigned || false;

  if (!captureId) {
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

  const uriCapture = await URICapture.findOneBy({ id: captureId });
  if (!uriCapture) {
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

  // generate presigned url
  if (preSigned && uriCapture.imagePath) {
    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: Bucket.sourceBucket.bucketName,
        Key: uriCapture.imagePath,
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...uriCapture,
        preSignedUrl: url,
      }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(uriCapture),
  };
});
