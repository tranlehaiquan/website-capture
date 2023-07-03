import "reflect-metadata";
import { DataSource } from "typeorm";
import { Website } from "./entity/Website";
import { URICapture } from "./entity/URICapture";

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
    entities: [Website, URICapture],
    migrations: [],
    subscribers: [],
    ssl: true,
  });

  await AppDataSource.initialize();
  connected = true;
};