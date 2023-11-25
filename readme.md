# TODO

- Auto setup chromium

## Getting started

```bash
# make dir layers/chromium
mkdir -p layers/chromium

# download release from @sparticuz/chromium then extract to layers/chromium
# https://github.com/Sparticuz/chromium/releases/tag/v119.0.0
# result will be layers/chromium/nodejs

# pnpm install
pnpm install

# open new terminal then install chromium
# will print chromium path, then update packages/core/src/puppeteerWorker.ts YOUR_LOCAL_CHROMIUM_PATH with it
npx @puppeteer/browsers install chromium@latest --path /tmp/localChromium
```

```bash
mkdir -p localChromium
# copy chromium to localChromium
```

Set sst secrets

```bash
npx sst secrets set POSTGRES_URL "postgres://..."
```

<!-- markdown insert image -->
![image](./solution-overview.jpeg)

## Develop

```bash
pnpm run dev
```

## Deploy

```bash
pnpm run deploy --stage prod
```