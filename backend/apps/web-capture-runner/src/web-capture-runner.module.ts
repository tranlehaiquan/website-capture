import { Module } from '@nestjs/common';
import { WebCaptureRunnerService } from './web-capture-runner.service';

@Module({
  imports: [],
  providers: [WebCaptureRunnerService],
})
export class WebCaptureRunnerModule {}
