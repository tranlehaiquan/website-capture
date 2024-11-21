import { Controller, Get, Post } from '@nestjs/common';
import { WebCaptureService } from './web-capture.service';

@Controller()
export class WebCaptureController {
  constructor(private readonly webCaptureService: WebCaptureService) {}

  @Get()
  getHello() {
    return this.webCaptureService.getHello();
  }

  @Post()
  insertUser() {
    console.log('Inserting a user into the database');
    return this.webCaptureService.insertUser();
  }
}
