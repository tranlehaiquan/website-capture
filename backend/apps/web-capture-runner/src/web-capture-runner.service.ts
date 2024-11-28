import { Injectable } from '@nestjs/common';

@Injectable()
export class WebCaptureRunnerService {
  getHello(): string {
    return 'Hello World!';
  }
}
