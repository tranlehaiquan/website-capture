# Getting started

```bash
# make dir layers/chromium
mkdir -p layers/chromium

# download release from @sparticuz/chromium then extract to layers/chromium
# result will be layers/chromium/nodejs

# pnpm install
pnpm install

# open new terminal then install chromium
# will print chromium path, then update packages/core/src/puppeteerWorker.ts YOUR_LOCAL_CHROMIUM_PATH with it
npx @puppeteer/browsers install chromium@latest --path /tmp/localChromium
```

```typescript
const YOUR_LOCAL_CHROMIUM_PATH = "/tmp/localChromium/...";
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