import { Config } from "sst/node/config";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Queue } from "sst/node/queue";
import * as yup from "yup";

import { Capture } from "@website-capture/core/entity/Capture";
import { getUserFromEvent } from "@website-capture/core/utils";
import middy from "@middy/core";
import {
  baseMiddlewares,
  connectDatabase,
  validator,
} from "@website-capture/core/middlewares";
import createHttpError from "http-errors";
import { validationOneTimeSchema } from 'shared';

const bodySchema = yup.object().shape({
  body: validationOneTimeSchema,
});

const sqsClient = new SQSClient({});

const postHandler = async (event: any) => {
  const user = await getUserFromEvent(event);

  try {
    // get type of bodySchema
    const { body } = bodySchema.cast(event);
    const { website } = body;

    // create capture
    const capture = new Capture();
    capture.website = website;
    capture.width = body.width;
    capture.height = body.height;
    capture.format = body.format as any;
    if (user) {
      capture.owner = user;
    }
    await capture.save();

    // send message to SQS
    const queueURL = Queue.queue.queueUrl.toString();
    const command = new SendMessageCommand({
      QueueUrl: queueURL,
      MessageBody: JSON.stringify({
        captureId: capture.id,
      }),
      DelaySeconds: 0,
    });
    await sqsClient.send(command);

    return {
      id: capture.id,
    };
  } catch (err: any) {
    throw new createHttpError.BadRequest(
      err?.message || "Something went wrong"
    );
  }
};

export const handler = middy(postHandler).use([
  ...baseMiddlewares,
  validator({
    schema: bodySchema,
  }),
  connectDatabase(Config.POSTGRES_URL),
]);
