import { Config } from "sst/node/config";
import CaptureServices from "@website-capture/core/services/captureServices"
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Bucket } from "sst/node/bucket";
import middy from "@middy/core";
import {
  baseMiddlewares,
  connectDatabase,
} from "@website-capture/core/middlewares";
import createError from 'http-errors';

const s3Client = new S3Client({});

const POSTGRES_URL = Config.POSTGRES_URL;
const captureServices = new CaptureServices();

const getHandler = async (_evt: any) => {
  const id = _evt.pathParameters?.id;

  // get url params
  const params = _evt.queryStringParameters || {};
  const captureId = id || params.id;
  const preSigned = params.preSigned || false;

  if (!captureId) {
    throw new createError.BadRequest('Missing id');
  }

  const uriCapture = await captureServices.getById(captureId);
  if (!uriCapture) {
    throw new createError.NotFound('Capture not found');
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
      ...uriCapture,
      preSignedUrl: url,
    };
  }

  return uriCapture;
};

export const handler = middy(getHandler).use([
  ...baseMiddlewares,
  connectDatabase(POSTGRES_URL),
]);
