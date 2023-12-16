import httpErrorHandler from "@middy/http-error-handler";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import jsonBodyParser from "@middy/http-json-body-parser";

const baseMiddlewares = [
  httpErrorHandler(),
  httpHeaderNormalizer(),
  jsonBodyParser({
    disableContentTypeError: true,
  }),
];

export default baseMiddlewares;