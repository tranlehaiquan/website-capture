import { User } from "@website-capture/core/entity/User";
import { Config } from "sst/node/config";
import middy from "@middy/core";
import { connectDatabase } from "@website-capture/core/middlewares";

const postHandler = async (event: any) => {
  const user = new User();
  user.username = event.request.userAttributes.email;
  user.cognitoId = event.userName;

  await user.save();

  return event;
};

export const handler = middy(postHandler).use([
  connectDatabase(Config.POSTGRES_URL),
]);
