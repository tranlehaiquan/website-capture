import fs from "fs-extra";
import unzipper from "unzipper";
import { pipeline } from "node:stream/promises";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// mkdir layers/chromium
const PATH_LAYERS = "layers/chromium";
fs.mkdirsSync(PATH_LAYERS);

const chromiumLayerLink =
  "https://github.com/Sparticuz/chromium/releases/download/v119.0.0/chromium-v119.0.0-layer.zip";

const downloadLayer = async () => {
  // const file = `${PATH_LAYERS}/chromium-v119.0.0-layer.zip`;
  const response = await fetch(chromiumLayerLink);
  if (!response.ok) {
    throw new Error(`Unexpected response ${response.statusText}`);
  }

  await pipeline(response.body, unzipper.Extract({ path: PATH_LAYERS }));
};

await downloadLayer();

const downloadLocalChromium = async () => {
  const chromiumLocal = "localChromium";
  fs.mkdirsSync(chromiumLocal);
  const PATH_LOCAL_CHROMIUM = join(__dirname, chromiumLocal);

  execSync(
    `npx @puppeteer/browsers install chromium@latest --path ${PATH_LOCAL_CHROMIUM}`
  );
};

// Setup localChromium if is dev mode
const IS_DEV = process.env.NODE_ENV === "development";
if (IS_DEV) {
  await downloadLocalChromium();
}
