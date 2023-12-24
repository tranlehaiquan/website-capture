import { Config } from "sst/node/config";
import { getUserFromEvent } from "@website-capture/core/utils";
import middy from "@middy/core";
import {
  baseMiddlewares,
  connectDatabase,
} from "@website-capture/core/middlewares";
import createHttpError from "http-errors";
import CaptureServices from "@website-capture/core/services/captureServices";
const captureServices = new CaptureServices();

// Query
// find by recursiveCaptureId
const getAllHandler = async (_evt: any) => {
  const user = await getUserFromEvent(_evt);
  const query = _evt.queryStringParameters || {};
  const { recursiveCaptureId, status } = query;

  if (!user || !user.id) {
    createHttpError.Unauthorized("Unauthorized");
  }

  const uriCaptures = await captureServices.findWhere({
    ownerId: user?.id,
    recursiveCaptureId,
    status,
  });
  return uriCaptures;
};

export const handler = middy(getAllHandler).use([
  ...baseMiddlewares,
  connectDatabase(Config.POSTGRES_URL),
]);
