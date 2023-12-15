import { RecursiveCapture } from "@website-capture/core/entity/RecursiveCapture";
import { User } from "@website-capture/core/entity/User";
import { getUserFromEvent } from "@website-capture/core/utils";
import { connectDB } from "src/data-source";
import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";

/**
 * New Capture with input bodySchema
 * This handle will be called when you make a POST request to /recurring-capture/{id}
 */
export const handler = ApiHandler(async (event) => {
  // get id from path /capture/{id}
  const id = event.pathParameters?.id;

  if (!id) {
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

  await connectDB(Config.POSTGRES_URL);
  const user = await getUserFromEvent(event);

  if (!user) {
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

  const recursiveCapture = await RecursiveCapture.findOneBy({
    id,
    ownerId: user.id,
  });

  // validate body
  try {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recursiveCapture),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }
});
