import { Test, TestingModule } from '@nestjs/testing';
import { WebCaptureController } from './web-capture.controller';
import { WebCaptureService } from './web-capture.service';

describe('WebCaptureController', () => {
  let webCaptureController: WebCaptureController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WebCaptureController],
      providers: [WebCaptureService],
    }).compile();

    webCaptureController = app.get<WebCaptureController>(WebCaptureController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(webCaptureController.getHello()).toBe('Hello World!');
    });
  });
});
