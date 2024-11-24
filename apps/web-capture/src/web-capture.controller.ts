import { Controller, Get } from '@nestjs/common';

@Controller()
export class WebCaptureController {
  @Get()
  getHello() {
    return 'Hello World!';
  }
}
