import { jwtDecode } from "jwt-decode";
import { User } from "src/entity/User";

const getUserFromEvent = async (event: any) => {
  // headers.authorization
  const authorization = event.headers.authorization;
  if (!authorization) {
    return null;
  }

  // Bearer token
  const token = authorization.split(" ")[1];
  if (!token) {
    return null;
  }

  const jwtInfo = jwtDecode(token);
  const { sub } = jwtInfo;

  const user = await User.findOneBy({ cognitoId: sub });
  return user;
};

export default getUserFromEvent;
