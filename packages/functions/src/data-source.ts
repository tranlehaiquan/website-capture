import "reflect-metadata";
import { DataSource } from "typeorm";
import { URICapture } from "./entity/URICapture";
import { User } from "./entity/User";

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