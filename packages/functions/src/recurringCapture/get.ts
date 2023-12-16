import middy from "@middy/core";
import { RecursiveCapture } from "@website-capture/core/entity/RecursiveCapture";
import {
  baseMiddlewares,
  connectDatabase,
} from "@website-capture/core/middlewares";
import { getUserFromEvent } from "@website-capture/core/utils";
import createHttpError from "http-errors";
import { connectDB } from "src/data-source";
import { Config } from "sst/node/config";

/**
 * New Capture with input bodySchema
 * This handle will be called when you make a POST request to /recurring-capture/{id}
 */
const getHandler = async (event: any) => {
  // get id from path /capture/{id}
  const id = event.pathParameters?.id;

  if (!id) {
    throw new createHttpError.BadRequest("Missing id");
  }

  await connectDB(Config.POSTGRES_URL);
  const user = await getUserFromEvent(event);

  if (!user) {
    throw new createHttpError.Unauthorized("Unauthorized");
  }

  const recursiveCapture = await RecursiveCapture.findOneBy({
    id,
    ownerId: user.id,
  });

  // validate body
  return recursiveCapture;
};

export const handler = middy(getHandler).use([
  ...baseMiddlewares,
  connectDatabase(Config.POSTGRES_URL),
]);
