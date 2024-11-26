import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SendMessageCommand, SQSClient, SQSClientConfig } from '@aws-sdk/client-sqs';
import { MESSAGE_QUEUE_OPTIONS } from './message-queue.constant';

@Injectable()
export class MessageQueueService implements OnModuleInit {
  sqsClient: SQSClient;
  config: SQSClientConfig;
  queueUrl: string;

  constructor(@Inject(MESSAGE_QUEUE_OPTIONS) config: SQSClientConfig & { queueUrl: string }) {
    console.log('config :>> ', config);
    this.config = config;
    this.queueUrl = config.queueUrl;
  }

  onModuleInit() {
    this.sqsClient = new SQSClient(this.config);
  }

  sendMessage(message: string | object) {
    const stringifyMsg = typeof message === 'string' ? message : JSON.stringify(message);
    console.log({
      QueueUrl: this.queueUrl,
      MessageBody: stringifyMsg,
      DelaySeconds: 0,
    });
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: stringifyMsg,
      DelaySeconds: 0,
    });

    return this.sqsClient.send(command);
  }
}
