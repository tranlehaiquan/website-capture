import { HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Context, Handler } from 'aws-lambda';
import { WebCaptureRunnerModule } from './web-capture-runner.module';
import { WebCaptureRunnerService } from './web-capture-runner.service';
import { SQSEvent } from 'aws-lambda';

const isDev = process.env.NODE_ENV !== 'production';

type EventBody = {
  captureId: string,
};

export const handler: Handler = async (event: SQSEvent, context: Context) => {
  const appContext = await NestFactory.createApplicationContext(
    WebCaptureRunnerModule,
  );
  const appService = appContext.get(WebCaptureRunnerService);

  console.log({ event });
  const body = JSON.parse(event.Records[0].body) as EventBody;

  return {
    body: appService.getHello(),
    statusCode: HttpStatus.OK,
  };
};

if (isDev) {
  handler(null, null, null);
}
