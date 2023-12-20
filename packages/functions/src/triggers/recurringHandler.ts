import { Status } from "shared";
import { Capture } from "@website-capture/core/entity/Capture";
import { Config } from "sst/node/config";
import middy from "@middy/core";
import { connectDatabase } from "@website-capture/core/middlewares";
import { RecursiveCapture } from "@website-capture/core/entity/RecursiveCapture";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Queue } from "sst/node/queue";

type EventPayload = {
  recursiveCaptureId: string;
};

const sqsClient = new SQSClient({});

// handler
const imageCleanerHandler = async (event: any) => {
  const { recursiveCaptureId }: EventPayload = event;

  const recursiveCapture = await RecursiveCapture.findOneBy({
    id: recursiveCaptureId,
  });

  if (!recursiveCapture) {
    throw new Error("Recursive capture not found");
  }

  // create Capture
  const capture = new Capture();
  capture.website = recursiveCapture.website;
  capture.width = recursiveCapture.width;
  capture.height = recursiveCapture.height;
  capture.format = recursiveCapture.format;
  capture.owner = recursiveCapture.owner;
  capture.recursiveCapture = recursiveCapture;
  capture.status = Status.inProcess;
  capture.recursiveCaptureId = recursiveCapture.id;
  await capture.save();

  // new sqs message
  const queueURL = Queue.queue.queueUrl.toString();
  const command = new SendMessageCommand({
    QueueUrl: queueURL,
    MessageBody: JSON.stringify({
      captureId: capture.id,
    }),
    DelaySeconds: 0,
  });
  await sqsClient.send(command);

  return event;
};

export const handler = middy(imageCleanerHandler).use([
  connectDatabase(Config.POSTGRES_URL),
]);
