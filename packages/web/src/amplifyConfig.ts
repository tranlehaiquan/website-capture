import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";

const config = {
  apiGateway: {
    REGION: import.meta.env.VITE_APP_REGION,
    URL: import.meta.env.VITE_APP_API_URL,
  },
};

console.log({
  userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
  userPoolClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
});

console.log({
  aws_cognito_region: import.meta.env.VITE_APP_REGION,
  aws_user_pools_id: import.meta.env.VITE_APP_USER_POOL_ID,
  aws_user_pools_web_client_id: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
});

// follow this https://docs.amplify.aws/javascript/prev/build-a-backend/restapi/customize-authz/
Amplify.configure(
  {
    aws_cognito_region: import.meta.env.VITE_APP_REGION,
    aws_user_pools_id: import.meta.env.VITE_APP_USER_POOL_ID,
    aws_user_pools_web_client_id: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
    aws_cloud_logic_custom: [
      {
        name: "capture",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
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
