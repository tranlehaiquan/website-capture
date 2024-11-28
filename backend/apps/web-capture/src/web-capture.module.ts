import { Module } from '@nestjs/common';
import { WebCaptureController } from './web-capture.controller';
import { ConfigModule } from '@nestjs/config';
import { CapturesModule } from './captures/captures.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CapturesModule,
  ],
  controllers: [WebCaptureController],
  providers: [],
})
export class WebCaptureModule {}
