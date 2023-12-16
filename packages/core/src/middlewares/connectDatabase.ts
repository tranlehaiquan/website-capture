import "reflect-metadata";
import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DataSource } from "typeorm";
import { Capture } from "../entity/Capture";
import { RecursiveCapture } from "../entity/RecursiveCapture";
import { User } from "../entity/User";

const connectDB = (url: string) => {
  let connected = false;

  const before: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async () => {
    if (connected) {
      return;
    }

    const AppDataSource = new DataSource({
      type: "postgres",
      url,
      synchronize: true,
      logging: false,
      entities: [Capture, User, RecursiveCapture],
      migrations: [],
      subscribers: [],
      ssl: true,
    });
    console.time('DB Connection Time');

    await AppDataSource.initialize();
    connected = true;
    console.timeEnd('DB Connection Time');
  };

  return {
    before,
  };
};

export default connectDB;
