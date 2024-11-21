import { DrizzleService, dbSchema } from '@app/drizzle-db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebCaptureService {
  constructor(private drizzle: DrizzleService) {}
  
  async getHello() {
    const users = await this.drizzle.drizzleClient.select().from(dbSchema.users);
    console.log('Getting all users from the database: ', users)

    return 'Hello World!';
  }

  async insertUser() {
    const random = Math.floor(Math.random() * 1000);

    const user: typeof dbSchema.users.$inferInsert = {
      name: 'John',
      age: random,
      email: 'john@example.com' + random,
    };

    return await this.drizzle.drizzleClient.insert(dbSchema.users).values(user).returning();
  }
}
