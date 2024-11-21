import { Module } from '@nestjs/common';
import { DrizzleService } from './drizzle-db.service';

@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
