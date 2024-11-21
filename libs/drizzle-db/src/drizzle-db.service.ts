import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  drizzle,
  NodePgClient,
  NodePgDatabase,
} from 'drizzle-orm/node-postgres';

@Injectable()
export class DrizzleService implements OnModuleInit {
  drizzleClient: NodePgDatabase<Record<string, never>> & {
    $client: NodePgClient;
  };

  async onModuleInit() {
    this.drizzleClient = drizzle(process.env.DATABASE_URL!);
    console.log(process.env.DATABASE_URL);
    console.log('Drizzle client connected to the database');
  }
}
