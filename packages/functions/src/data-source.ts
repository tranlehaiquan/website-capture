import "reflect-metadata";
import { DataSource } from "typeorm";
import { URICapture } from "@website-capture/core/entity/URICapture";
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
    entities: [URICapture, User],
    migrations: [],
    subscribers: [],
    ssl: true,
  });

  await AppDataSource.initialize();
  connected = true;
};