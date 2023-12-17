import { Config } from "sst/node/config";
import { Capture } from "@website-capture/core/entity/Capture";
import { getUserFromEvent } from "@website-capture/core/utils";
import middy from "@middy/core";
import {
  baseMiddlewares,
  connectDatabase,
} from "@website-capture/core/middlewares";
import createHttpError from "http-errors";

const getAllHandler = async (_evt: any) => {
  const user = await getUserFromEvent(_evt);

  if (!user) {
    createHttpError.Unauthorized("Unauthorized");
  }

  const uriCaptures = await Capture.find({
    where: { ownerId: user?.id },
  });

  return uriCaptures;
};

export const handler = middy(getAllHandler).use([
  ...baseMiddlewares,
  connectDatabase(Config.POSTGRES_URL),
]);
