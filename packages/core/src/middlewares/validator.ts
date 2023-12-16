import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as yup from "yup";
import createError from "http-errors";
import { pick } from "lodash";

const validator = ({
  schema,
  options,
}: {
  schema: yup.Schema;
  options?: yup.ValidateOptions<any>;
}) => {
  if (!yup.isSchema(schema)) {
    console.log(
      "[middy-yup] The schema you provided is not a valid Yup schema"
    );
    throw new Error("Invalid schema");
  }

  const before: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async (handler) => {
    const event = handler.event;
    try {
      await schema.validate(event, options);
    } catch (err: any) {
      const error = new createError.BadRequest(
        JSON.stringify({
          ...pick(err, ["message", "errors"]),
        })
      );
      handler.event.headers = Object.assign({}, handler.event.headers);
      error.details = err.message;

      throw error;
    }
  };

  return {
    before,
  };
};

export default validator;