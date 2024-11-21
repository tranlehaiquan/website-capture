import { Module } from '@nestjs/common';
import { WebCaptureController } from './web-capture.controller';
import { WebCaptureService } from './web-capture.service';
import { DrizzleModule } from '@app/drizzle-db';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), DrizzleModule],
  controllers: [WebCaptureController],
  providers: [WebCaptureService],
})
export class WebCaptureModule {}
