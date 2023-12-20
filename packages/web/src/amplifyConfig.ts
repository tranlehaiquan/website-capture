import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";

const config = {
  apiGateway: {
    REGION: import.meta.env.VITE_APP_REGION,
    URL: import.meta.env.VITE_APP_API_URL,
  },
};

// follow this https://docs.amplify.aws/javascript/prev/build-a-backend/restapi/customize-authz/
Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
        userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
      }
    },
    API: {
      REST: {
        "capture": {
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION,
        },
      }
    }
  },
  {
    API: {
      REST: {
        headers: async () => {
          const authToken = (
            await fetchAuthSession()
          ).tokens?.idToken?.toString();
          return { Authorization: `Bearer ${authToken}` };
        },
      },
    },
  }
);

console.log("Amplify.configure", Amplify.getConfig());
