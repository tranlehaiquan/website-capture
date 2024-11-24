import { Module } from '@nestjs/common';
import CapturesController from './captures.controller';
import CapturesRepo from '../repositories/captures.repo';
import { DrizzleModule } from '@app/drizzle-db';

@Module({
  imports: [
    DrizzleModule,
  ],
  controllers: [
    CapturesController,
  ],
  providers: [
    CapturesRepo
  ],
})
export class CapturesModule {}
