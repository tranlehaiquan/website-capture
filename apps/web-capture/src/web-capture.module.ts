import { Module } from '@nestjs/common';
import { WebCaptureController } from './web-capture.controller';
import { WebCaptureService } from './web-capture.service';

@Module({
  imports: [],
  controllers: [WebCaptureController],
  providers: [WebCaptureService],
})
export class WebCaptureModule {}
