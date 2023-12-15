import "reflect-metadata";
import { DataSource } from "typeorm";
import { Capture } from "@website-capture/core/entity/Capture";
import { RecursiveCapture } from "@website-capture/core/entity/RecursiveCapture";
import { User } from "@website-capture/core/entity/User";

let connected = false;

export const connectDB = async (url: string) => {
  if(connected) {
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

  await AppDataSource.initialize();
  connected = true;
};