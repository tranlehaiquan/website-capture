import { SQSEvent } from "aws-lambda";
import { connectDB } from "./data-source";
import { Config } from "sst/node/config";
import { Status, URICapture } from "./entity/URICapture";

import { Website } from "./entity/Website";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Bucket } from "sst/node/bucket";
import getWorker from "@website-capture/core/puppeteerWorker";

const s3Client = new S3Client({});

export const handler = async (_evt: SQSEvent) => {
  const records = _evt.Records;
  const failedIDs: { itemIdentifier: string }[] = [];

  const browser = await getWorker();

  // connect db
  const POSTGRES_URL = Config.POSTGRES_URL;
  await connectDB(POSTGRES_URL);

  await Promise.all(
    records.map(async (record) => {
      const body = JSON.parse(record.body);
      const captureId = body.captureId;

      const capture = await URICapture.findOneBy({ id: captureId });
      if (capture) {
        try {
          let format = capture.format ? capture.format : "jpeg";

          if (format === "jpg") {
            format = "jpeg";
          }

          const website = await Website.findOneBy({ id: capture.websiteId });
          const key = `${captureId}.${capture.format}`;

          if (!website) {
            failedIDs.push({ itemIdentifier: record.messageId });
            return;
          }

          const page = await browser.newPage();

          page.setViewport({
            width: capture.width,
            height: capture.height,
          });

          await page.goto(website.uri);

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
        } catch (e) {
          console.error(e);
          capture.status = Status.failed;
          await capture?.save();
          failedIDs.push({
            itemIdentifier: record.messageId,
          });
        }
      }
    })
  );

  const pages = await browser.pages();
  for (let i = 0; i < pages.length; i++) {
    await pages[i].close();
  }
  await browser.close();

  console.log({
    batchItemFailures: failedIDs,
  });
  return {
    batchItemFailures: failedIDs,
  };
};
