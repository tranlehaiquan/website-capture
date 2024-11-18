const api = new sst.aws.ApiGatewayV2("MyApi");

api.route("GET /", "packages/functions/src/api.handler");
api.route("GET /captures/{captureID}", "packages/functions/src/api.handler");
api.route("POST /captures", "packages/functions/src/api.handler");

export default api;