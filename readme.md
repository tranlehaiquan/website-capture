# TODO

- Auto setup chromium

## Getting started

```bash
pnpm install && NODE_ENV=development node ./setup.js
```

Set sst secrets

```bash
npx sst secrets set POSTGRES_URL "postgres://..."
```

<!-- markdown insert image -->

![image](./solution-overview.jpeg)

<!-- markdown flow chart capture -->

![image](./capture-one-time.jpeg)

<!-- markdown flow chart recurring -->

![image](./capture-recurring.jpeg)

## Develop

```bash
pnpm run dev
```

## Deploy

```bash
pnpm run deploy --stage prod
```
