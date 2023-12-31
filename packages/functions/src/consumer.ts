import { SQSEvent } from "aws-lambda";
import { Config } from "sst/node/config";
import { Capture } from "@website-capture/core/entity/Capture";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  SchedulerClient,
  CreateScheduleCommand,
  type CreateScheduleCommandInput,
} from "@aws-sdk/client-scheduler"; // ES Modules import
import { Bucket } from "sst/node/bucket";
import getWorker from "@website-capture/core/puppeteerWorker";
import { Status } from "shared";
import middy from "@middy/core";
import { connectDatabase } from "@website-capture/core/middlewares";

const s3Client = new S3Client({});
const schedulerClient = new SchedulerClient({});
const RETRY_ATTEMPTS = 3;

const consumerHandler = async (_evt: SQSEvent) => {
  const records = _evt.Records;
  const failedIDs: { itemIdentifier: string }[] = [];

  const browser = await getWorker();

  const jobs = records.map(async (record) => {
    const body = JSON.parse(record.body);
    const captureId = body.captureId;

    const capture = await Capture.findOneBy({ id: captureId });
    if (capture) {
      try {
        let format = capture.format ? capture.format : "jpeg";

        if (format === "jpg") {
          format = "jpeg";
        }

        const key = `${captureId}.${capture.format}`;

        if (!capture.website) {
          failedIDs.push({ itemIdentifier: record.messageId });
          return;
        }

        const page = await browser.newPage();

        page.setViewport({
          width: capture.width,
          height: capture.height,
        });

        await page.goto(capture.website);

        const buffer = await page.screenshot({
          type: format as any,
        });

        const command = new PutObjectCommand({
          Bucket: Bucket.sourceBucket.bucketName,
          Key: key,
          Body: buffer,
          ContentType: `image/${format}`,
        });

        await s3Client.send(command);

        capture.status = Status.successful;
        capture.imagePath = key;
        await capture.save();

        // now + 1 day
        const date = new Date();
        date.setDate(date.getDate() + 1);
        // format yyyy-mm-ddThh:mm:ss
        const dateISO = date.toISOString().split(".")[0];
        // format at(yyyy-mm-ddThh:mm:ss)
        const ScheduleExpression = `at(${dateISO})`;

        // schedule deletion
        const inputScheduler: CreateScheduleCommandInput = {
          Name: `cleanImage${captureId}`, // required
          ScheduleExpression,
          Description: `delete Image ${captureId}`,
          Target: {
            // Target
            Arn: process.env.TARGET_ARN, // required
            RoleArn: process.env.TARGET_ROLE_ARN,
            RetryPolicy: {
              MaximumRetryAttempts: RETRY_ATTEMPTS,
            },
            Input: JSON.stringify({
              captureId,
            }),
          },
          FlexibleTimeWindow: {
            Mode: "OFF",
            MaximumWindowInMinutes: undefined,
          },
          ActionAfterCompletion: "DELETE",
        };

        const commandScheduler = new CreateScheduleCommand(inputScheduler);
        await schedulerClient.send(commandScheduler);
      } catch (e) {
        console.error({
          message: `Error while capturing ${captureId}`,
          error: e,
        });
        capture.status = Status.failed;
        await capture?.save();
        failedIDs.push({
          itemIdentifier: record.messageId,
        });
      }
    }
  });

  await Promise.allSettled(jobs);
  const pages = await browser.pages();
  await Promise.all(pages.map(page => page.close()));
  // for (let i = 0; i < pages.length; i++) {
  //   await pages[i].close();
  // }
  await browser.close();

  return {
    batchItemFailures: failedIDs,
  };
};

export const handler = middy(consumerHandler).use([
  connectDatabase(Config.POSTGRES_URL),
]);
