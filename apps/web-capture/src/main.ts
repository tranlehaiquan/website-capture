import { NestFactory } from '@nestjs/core';
import { WebCaptureModule } from './web-capture.module';

async function bootstrap() {
  const app = await NestFactory.create(WebCaptureModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
