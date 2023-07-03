import { SQSEvent } from "aws-lambda";
import { connectDB } from "./data-source";
import { Config } from "sst/node/config";
import { Status, URICapture } from "./entity/URICapture";

import puppeteer from "puppeteer-core";
import { Website } from "./entity/Website";
import chromium from '@sparticuz/chromium';

export const handler = async (_evt: SQSEvent) => {
  const records = _evt.Records;
  const failedIDs: string[] = [];

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.IS_LOCAL ? `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` : await chromium.executablePath(),
    headless: chromium.headless,
  });
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  await page.close();
  await browser.close();

  // connect db
  // const POSTGRES_URL = Config.POSTGRES_URL;
  // await connectDB(POSTGRES_URL);

  // await Promise.all(
  //   records.map(async (record) => {
  //     const body = JSON.parse(record.body);
  //     const captureId = body.captureId;

  //     const capture = await URICapture.findOneBy({ id: captureId });
  //     if (capture) {
  //       const website = await Website.findOneBy({ id: capture.websiteId });

  //       if (!website) {
  //         failedIDs.push(captureId);
  //         return;
  //       }

  //       const page = await browser.newPage();
  //       await page.goto(website.uri);

  //       const captureStream = page.screenshot({
  //         type: 'jpeg',
  //         fullPage: true,
  //       })

  //       console.log('scuccessfully captured screenshot');
  //       capture.status = Status.successful;
  //       await capture.save();
  //     }
  //   })
  // );

  return {
    statusCode: 200,
    body: JSON.stringify(failedIDs),
  };
};
