import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: [
      process.env.WEB_URL || 'http://localhost:3000',
      process.env.LANDING_URL || 'http://localhost:3002',
    ],
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger / OpenAPI docs
  const config = new DocumentBuilder()
    .setTitle('WhatsApp Business Platform API')
    .setDescription('Complete API for the WhatsApp Business messaging platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication & registration')
    .addTag('organizations', 'Organization management')
    .addTag('whatsapp', 'WhatsApp Cloud API integration')
    .addTag('contacts', 'Contact management')
    .addTag('conversations', 'Conversation & messaging')
    .addTag('templates', 'Message template management')
    .addTag('broadcasts', 'Broadcast campaign management')
    .addTag('analytics', 'Analytics & reporting')
    .addTag('automation', 'Workflow automation')
    .addTag('crm', 'CRM pipeline & deals')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API server running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
