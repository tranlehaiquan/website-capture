import { SQSEvent } from "aws-lambda";
import { connectDB } from "./data-source";
import { Config } from "sst/node/config";
import { Status, URICapture } from "./entity/URICapture";

import puppeteer from "puppeteer-core";
import { Website } from "./entity/Website";
import chromium from '@sparticuz/chromium';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Bucket } from "sst/node/bucket";

const s3Client = new S3Client({});

export const handler = async (_evt: SQSEvent) => {
  const records = _evt.Records;
  const failedIDs: string[] = [];

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.IS_LOCAL
      ? "/tmp/localChromium/chromium/mac-1165199/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
      : await chromium.executablePath(),
    headless: chromium.headless,
  });

  // connect db
  const POSTGRES_URL = Config.POSTGRES_URL;
  await connectDB(POSTGRES_URL);


  await Promise.all(
    records.map(async (record) => {
      const body = JSON.parse(record.body);
      const captureId = body.captureId;

      const capture = await URICapture.findOneBy({ id: captureId });
      const key = `${captureId}.jpeg`;
      if (capture) {
        const website = await Website.findOneBy({ id: capture.websiteId });

        if (!website) {
          failedIDs.push(captureId);
          return;
        }
        console.log(website);

        const page = await browser.newPage();
        await page.goto(website.uri);

        const buffer = await page.screenshot({
          type: 'jpeg',
        });

        const command = new PutObjectCommand({
          Bucket: Bucket.sourceBucket.bucketName,
          Key: key,
          Body: buffer,
        });

        await s3Client.send(command);

        console.log('scuccessfully captured screenshot');
        capture.status = Status.successful;
        capture.imagePath = key;
        await capture.save();
      }
    })
  );

  const pages = await browser.pages();
  for(let i = 0; i < pages.length; i++) {
    await pages[i].close();
  }
  await browser.close();
  console.log('close all');

  return {
    statusCode: 200,
    body: JSON.stringify(failedIDs),
  };
};
