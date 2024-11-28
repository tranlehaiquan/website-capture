import { Module } from '@nestjs/common';
import { WebCaptureRunnerController } from './web-capture-runner.controller';
import { WebCaptureRunnerService } from './web-capture-runner.service';

@Module({
  imports: [],
  controllers: [WebCaptureRunnerController],
  providers: [WebCaptureRunnerService],
})
export class WebCaptureRunnerModule {}
