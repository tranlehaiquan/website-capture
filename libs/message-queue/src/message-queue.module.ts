import { Module, DynamicModule } from '@nestjs/common';
import { MessageQueueService } from './message-queue.service';
import { SQSClientConfig } from '@aws-sdk/client-sqs';
import { MESSAGE_QUEUE_OPTIONS } from './message-queue.constant';

@Module({})
export class MessageQueueModule {
  static register(config: SQSClientConfig & { queueUrl: string }): DynamicModule {
    return {
      module: MessageQueueModule,
      providers: [
        {
          provide: MESSAGE_QUEUE_OPTIONS,
          useValue: config,
        },
        MessageQueueService,
      ],
      exports: [MessageQueueService],
    };
  }
}
