import { Bucket } from "sst/node/bucket";

import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ApiHandler } from "sst/node/api";

// pre-signed
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({});

export const handler = ApiHandler(async (_evt) => {
  // get params
  const params = _evt.queryStringParameters || {};
  const url = params.url;
  const failedIDs: string[] = [];

  if (!url) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Cant not found!",
      }),
    };
  }

  console.log("url", url);
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.IS_LOCAL
      ? "/tmp/localChromium/chromium/mac-1165199/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
      : await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const buffer = await page.screenshot({ type: "jpeg" });
  await page.close();

  // random key
  const uid = Math.round(Math.random() * 100);
  const key = `${uid}.jpeg`;

  // Upload the image to the S3 bucket
  await s3Client.send(
    new PutObjectCommand({
      Bucket: Bucket.sourceBucket.bucketName,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
    })
  );

  console.log("uploaded");

  // get pre-signed url
  const urlResult = await getSignedUrl(s3Client, new GetObjectCommand({
    Bucket: Bucket.sourceBucket.bucketName,
    Key: key,
  }));

  const pages = await browser.pages();
  for(let i = 0; i < pages.length; i++) {
    await pages[i].close();
  }

  await browser.close();
  console.log('close all');

  return {
    statusCode: 200,
    body: JSON.stringify({
      urlResult,
    }),
  };
});
