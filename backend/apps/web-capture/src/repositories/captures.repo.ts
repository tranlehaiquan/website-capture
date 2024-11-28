import { DrizzleService } from '@app/drizzle-db';
import { Injectable } from '@nestjs/common';
import { dbSchema } from '@app/drizzle-db';
import { eq } from 'drizzle-orm';

export enum CaptureStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Injectable()
class CapturesRepo {
  constructor(private drizzle: DrizzleService) {}
  async create(newCapture: typeof dbSchema.captures.$inferInsert) {
    return this.drizzle.drizzleClient
      .insert(dbSchema.captures)
      .values(newCapture)
      .returning();
  }

  async findOneById(id: string) {
    const result = await this.drizzle.drizzleClient
      .select()
      .from(dbSchema.captures)
      .where(eq(dbSchema.captures.id, id))
      .execute();

    return result[0];
  }

  async findAll() {
    return this.drizzle.drizzleClient
      .select()
      .from(dbSchema.captures)
      .execute();
  }
}

export default CapturesRepo;
