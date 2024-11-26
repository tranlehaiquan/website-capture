import { Module } from '@nestjs/common';
import CapturesController from './captures.controller';
import CapturesRepo from '../repositories/captures.repo';
import { DrizzleModule } from '@app/drizzle-db';
import CapturesServices from './captures.services';
import { SQSModule } from '../sqs/sqs.module';

@Module({
  imports: [
    DrizzleModule.register({
      databaseURL: process.env.DATABASE_URL,
    }),
    SQSModule,
  ],
  controllers: [CapturesController],
  providers: [CapturesRepo, CapturesServices],
})
export class CapturesModule {}
