import { NestFactory } from '@nestjs/core';
import { WebCaptureModule } from './web-capture.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(WebCaptureModule);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Capture example')
    .setDescription('The Capture API description')
    .setVersion('1.0')
    .addTag('Capture')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
