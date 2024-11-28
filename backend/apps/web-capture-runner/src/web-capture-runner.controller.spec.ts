import { Test, TestingModule } from '@nestjs/testing';
import { WebCaptureRunnerController } from './web-capture-runner.controller';
import { WebCaptureRunnerService } from './web-capture-runner.service';

describe('WebCaptureRunnerController', () => {
  let webCaptureRunnerController: WebCaptureRunnerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WebCaptureRunnerController],
      providers: [WebCaptureRunnerService],
    }).compile();

    webCaptureRunnerController = app.get<WebCaptureRunnerController>(WebCaptureRunnerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(webCaptureRunnerController.getHello()).toBe('Hello World!');
    });
  });
});
