import fs from "fs-extra";
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

// mkdir layers/chromium
const PATH_LAYERS = "layers/chromium";
fs.mkdirsSync(PATH_LAYERS);

// download chromium-v119.0.0-layer.zip to layers/chromium
// https://github.com/Sparticuz/chromium/releases/download/v119.0.0/chromium-v119.0.0-layer.zip

const chromiumLayerLink =
  "https://github.com/Sparticuz/chromium/releases/download/v119.0.0/chromium-v119.0.0-layer.zip";

(async () => {
  const file = `${PATH_LAYERS}/chromium-v119.0.0-layer.zip`;
  const response = await fetch(chromiumLayerLink);
  if (!response.ok) {
    throw new Error(`Unexpected response ${response.statusText}`);
  }

  await streamPipeline(response.body, fs.createWriteStream(file));
  console.log("Download complete");

  // const reader = chromiumLayerResponse.body.getReader();

  // while (true) {
  //   const { done, value } = await reader.read();
  //   if (done) {
  //     console.log("done");
  //     break;
  //   }

  //   console.log(`Received ${value.length} bytes`);
  // }
})();
