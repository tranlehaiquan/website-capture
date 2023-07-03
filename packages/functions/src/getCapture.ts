import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";
import { connectDB } from "./data-source";
import { URICapture } from "./entity/URICapture";

export const handler = ApiHandler(async (_evt) => {
  // get config
  const POSTGRES_URL = Config.POSTGRES_URL;
  // connect db
  await connectDB(POSTGRES_URL);
  // get url params
  const params = _evt.queryStringParameters || {};
  const captureId = params.id;

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

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(uriCapture),
  };
});
