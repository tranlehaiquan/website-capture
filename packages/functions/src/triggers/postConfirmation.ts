import { User } from "../entity/User";
import { connectDB } from "../data-source";
import { Config } from "sst/node/config";

export const handler = async (event: any) => {
  // get config
  const POSTGRES_URL = Config.POSTGRES_URL;
  // connect db
  await connectDB(POSTGRES_URL);
  
  const user = new User();
  user.username = event.request.userAttributes.email;
  user.cognitoId = event.userName;

  await user.save();

  return event;
};
