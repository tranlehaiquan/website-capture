import middy from "@middy/core";
import baseMiddlewares from "@website-capture/core/middlewares/baseMiddlewares";

const baseHandler = (event: any) => {
  console.log(event);
  return { a: 1 }
};

// export handler
export const handler = middy(baseHandler).use([
  ...baseMiddlewares,
]);
