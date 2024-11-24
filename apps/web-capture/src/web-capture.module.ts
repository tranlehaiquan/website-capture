import { Module } from '@nestjs/common';
import { WebCaptureController } from './web-capture.controller';
import { WebCaptureService } from './web-capture.service';
import { DrizzleModule } from '@app/drizzle-db';
import { ConfigModule } from '@nestjs/config';
import { CapturesModule } from './captures/captures.module';

@Module({
  imports: [ConfigModule.forRoot(), DrizzleModule, CapturesModule],
  controllers: [WebCaptureController],
  providers: [WebCaptureService],
})
export class WebCaptureModule {}
