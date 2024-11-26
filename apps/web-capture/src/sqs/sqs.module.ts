import { MessageQueueModule } from '@app/message-queue';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const getSQSConfig = () => {
  return !(process.env.NODE_ENV === 'production')
    ? {
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        queueUrl: process.env.AWS_QUEUE_URL,
      }
    : {
        queueUrl: process.env.AWS_QUEUE_URL,
      };
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    MessageQueueModule.register(getSQSConfig()),
  ],
  exports: [MessageQueueModule],
})
export class SQSModule {}
