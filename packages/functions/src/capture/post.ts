import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Queue } from "sst/node/queue";
import * as yup from "yup";

import { connectDB } from "../data-source";
import { Website } from "../entity/Website";
import { URICapture } from "../entity/URICapture";

const bodySchema = yup.object().shape({
  uri: yup.string().required(),
  height: yup.number().required(),
  width: yup.number().required(),
  format: yup.mixed().oneOf(["jpg", "png", "webp"]).default("jpg"),
});

const sqsClient = new SQSClient({});

/**
 * New Capture with input bodySchema
 * This handle will be called when you make a POST request to /capture
 * 
 */
export const handler = ApiHandler(async (event) => {
  await connectDB(Config.POSTGRES_URL);

  // get body from event
  const bodyParsed = JSON.parse(event.body || "{}");

  // validate body
  try {
    const body = await bodySchema.validate(bodyParsed);

    const { uri } = bodyParsed;

    // check if website exists
    let website = await Website.findOne({ where: { uri } });

    // check if website is already being captured
    if (!website) {
      website = new Website();
      website.uri = uri;
      await website.save();
    }

    // create capture
    const capture = new URICapture();
    capture.website = website;
    capture.width = body.width;
    capture.height = body.height;
    capture.format = body.format as any;
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
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: capture.id,
      }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }
});
