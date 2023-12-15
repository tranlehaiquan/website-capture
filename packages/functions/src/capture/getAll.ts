import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";
import { connectDB } from "../data-source";
import { Capture } from "@website-capture/core/entity/Capture";
import { getUserFromEvent } from "@website-capture/core/utils";

export const handler = ApiHandler(async (_evt) => {
  await connectDB(Config.POSTGRES_URL);
  const user = await getUserFromEvent(_evt);

  if(!user) {
    return {
      statusCode: 401,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  const uriCaptures = await Capture.find({
    where: { ownerId: user.id },
  });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(uriCaptures),
  };
});
