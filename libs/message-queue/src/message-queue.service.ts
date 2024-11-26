import { Injectable, OnModuleInit } from '@nestjs/common';
import { SQSClient, ListQueuesCommand, SendMessageCommand } from "@aws-sdk/client-sqs";

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

// for running local
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;
// NOTE: this url must be config in Fargate environment
const MESSAGE_QUEUE_URL = process.env.MESSAGE_QUEUE_URL;

@Injectable()
export class MessageQueueService implements OnModuleInit {
  sqsClient: SQSClient;
  
  onModuleInit() {
    if (isDev) {
      console.log('Running in development mode');
      console.log('AWS_ACCESS_KEY_ID:', AWS_ACCESS_KEY_ID);
      console.log('AWS_REGION:', AWS_REGION);
      console.log('MESSAGE_QUEUE_URL:', MESSAGE_QUEUE_URL);
      console.log('AWS_SECRET_ACCESS_KEY:', AWS_SECRET_ACCESS_KEY);
      
      this.sqsClient = new SQSClient({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        }
      })
    }

    if (isProd) {
      console.log('Running in production mode');
      // IAM assumed role
      this.sqsClient = new SQSClient({});
    }
  }

  sendMessage(message: string) {
    const params = {
      QueueUrl: MESSAGE_QUEUE_URL,
      MessageBody: message,
    };

    const command = new SendMessageCommand(params);
    return this.sqsClient.send(command);
  }
}
