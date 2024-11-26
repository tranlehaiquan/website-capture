import { Module } from '@nestjs/common';
import { WebCaptureController } from './web-capture.controller';
import { ConfigModule } from '@nestjs/config';
import { CapturesModule } from './captures/captures.module';
import { MessageQueueModule } from '@app/message-queue';

const isProd = process.env.NODE_ENV === 'production';
// for running local
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;
// NOTE: this url must be config in Fargate environment
const MESSAGE_QUEUE_URL = process.env.MESSAGE_QUEUE_URL;

const messageQueueConfig = !isProd
  ? {
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      queueUrl: MESSAGE_QUEUE_URL,
    }
  : {
      queueUrl: MESSAGE_QUEUE_URL,
    };

@Module({
  imports: [
    ConfigModule.forRoot(),
    MessageQueueModule.register(messageQueueConfig),
    CapturesModule,
  ],
  controllers: [WebCaptureController],
  providers: [],
})
export class WebCaptureModule {}
