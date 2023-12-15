import fs from "fs-extra";
import { pipeline } from "node:stream/promises";
import unzipper from 'unzipper';

// mkdir layers/chromium
const PATH_LAYERS = "layers/chromium";
fs.mkdirsSync(PATH_LAYERS);

// download chromium-v119.0.0-layer.zip to layers/chromium
// https://github.com/Sparticuz/chromium/releases/download/v119.0.0/chromium-v119.0.0-layer.zip

const chromiumLayerLink =
  "https://github.com/Sparticuz/chromium/releases/download/v119.0.0/chromium-v119.0.0-layer.zip";

(async () => {
  // const file = `${PATH_LAYERS}/chromium-v119.0.0-layer.zip`;
  const response = await fetch(chromiumLayerLink);
  if (!response.ok) {
    throw new Error(`Unexpected response ${response.statusText}`);
  }

  await pipeline(response.body, unzipper.Extract({ path: PATH_LAYERS }));
})();
