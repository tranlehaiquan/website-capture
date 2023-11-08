import { Amplify, Auth } from "aws-amplify";

const config = {
  apiGateway: {
    REGION: import.meta.env.VITE_APP_REGION,
    URL: import.meta.env.VITE_APP_API_URL,
  },
};

console.log(import.meta.env.VITE_APP_USER_POOL_CLIENT_ID);

Amplify.configure({
  Auth: {
    region: import.meta.env.VITE_APP_REGION,
    userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
  },
  API: {
    endpoints: [
      {
        name: "capture",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
        custom_header: async () => {
          // Alternatively, with Cognito User Pools use this:
          // return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }
          return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
        }
      },
    ],
  },
});
