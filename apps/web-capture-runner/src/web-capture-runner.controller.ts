import { Controller, Get } from '@nestjs/common';
import { WebCaptureRunnerService } from './web-capture-runner.service';

@Controller()
export class WebCaptureRunnerController {
  constructor(private readonly webCaptureRunnerService: WebCaptureRunnerService) {}

  @Get()
  getHello(): string {
    return this.webCaptureRunnerService.getHello();
  }
}
