import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

import { connectDB } from "../data-source";
import { Website } from "../entity/Website";
import { URICapture } from "../entity/URICapture";
import { Queue } from "sst/node/queue";

const sqsClient = new SQSClient({});

export const handler = ApiHandler(async (event) => {
  await connectDB(Config.POSTGRES_URL);

  // get body from event
  const bodyParsed = JSON.parse(event.body || "{}");
  // TODO - validate body

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
});
