import { HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Callback, Context, Handler } from 'aws-lambda';
import { WebCaptureRunnerModule } from './web-capture-runner.module';
import { WebCaptureRunnerService } from './web-capture-runner.service';

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const appContext = await NestFactory.createApplicationContext(WebCaptureRunnerModule);
  const appService = appContext.get(WebCaptureRunnerService);

  return {
    body: appService.getHello(),
    statusCode: HttpStatus.OK,
  };
};