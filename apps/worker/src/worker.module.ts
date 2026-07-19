import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './common/prisma/prisma.module';
import { SendMessageProcessor } from './processors/send-message.processor';
import { WebhookProcessor } from './processors/webhook.processor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_URL
          ? new URL(process.env.REDIS_URL).hostname
          : 'localhost',
        port: process.env.REDIS_URL
          ? parseInt(new URL(process.env.REDIS_URL).port || '6379')
          : 6379,
      },
    }),
    PrismaModule,
  ],
  providers: [SendMessageProcessor, WebhookProcessor],
})
export class WorkerModule {}
