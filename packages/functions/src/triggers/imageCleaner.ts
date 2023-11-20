import { ApiHandler } from "sst/node/api";

// handler
export const handler = ApiHandler((event: any) => {
  // TODO: handle delete image here
  console.log(event);
  return event;
})
