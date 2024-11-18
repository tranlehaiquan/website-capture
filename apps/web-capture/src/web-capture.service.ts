import { Injectable } from '@nestjs/common';

@Injectable()
export class WebCaptureService {
  getHello(): string {
    return 'Hello World!';
  }
}
