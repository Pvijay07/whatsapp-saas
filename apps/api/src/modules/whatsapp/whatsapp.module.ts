import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { QUEUE_NAMES } from '@whatsapp-platform/shared';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUE_NAMES.SEND_MESSAGE },
      { name: QUEUE_NAMES.WEBHOOK_EVENTS },
    ),
  ],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
