import { Controller, Get, Post } from '@nestjs/common';
import { WebCaptureService } from './web-capture.service';

@Controller()
export class WebCaptureController {
  constructor(private readonly webCaptureService: WebCaptureService) {}

  @Post()
  insertUser() {
    console.log('Inserting a user into the database');
    return this.webCaptureService.insertUser();
  }

  @Get()
  getHello() {
    return this.webCaptureService.getHello();
  }
}
