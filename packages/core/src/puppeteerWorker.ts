import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const YOUR_LOCAL_CHROMIUM_PATH =
  "/tmp/localChromium/chromium/mac_arm-1219983/chrome-mac/Chromium.app/Contents/MacOS/Chromium";

const getWorker = async () => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.IS_LOCAL
      ? YOUR_LOCAL_CHROMIUM_PATH
      : await chromium.executablePath(),
    headless: chromium.headless,
  });

  return browser;
}

export const screenshot = async (url: string) => {
  const browser = await getWorker();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const buffer = await page.screenshot({ type: "jpeg" });
  await page.close();

  const pages = await browser.pages();
  for (let i = 0; i < pages.length; i++) {
    await pages[i].close();
  }

  await browser.close();

  return buffer;
}

export default getWorker;