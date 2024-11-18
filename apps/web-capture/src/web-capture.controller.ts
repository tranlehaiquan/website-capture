import { Controller, Get } from '@nestjs/common';
import { WebCaptureService } from './web-capture.service';

@Controller()
export class WebCaptureController {
  constructor(private readonly webCaptureService: WebCaptureService) {}

  @Get()
  getHello(): string {
    return this.webCaptureService.getHello();
  }
}
