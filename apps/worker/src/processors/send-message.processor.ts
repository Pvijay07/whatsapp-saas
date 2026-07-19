import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { QUEUE_NAMES, META_GRAPH_URL, META_API_VERSION } from '@whatsapp-platform/shared';

@Processor(QUEUE_NAMES.SEND_MESSAGE)
export class SendMessageProcessor extends WorkerHost {
  private readonly logger = new Logger(SendMessageProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    const { messageId, phoneNumberId, accessToken, recipientWaId, type, content } = job.data;
    this.logger.log(`Processing outbound message send job for Message ID: ${messageId}`);

    // Update status to SENDING (or keep as QUEUED, but let's track execution progress)
    await this.prisma.message.update({
      where: { id: messageId },
      data: { status: 'SENT' }, // Let's mark it sent locally if request succeeds
    });

    const url = `${META_GRAPH_URL}/${META_API_VERSION}/${phoneNumberId}/messages`;

    // Construct Meta message payload
    const payload: any = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipientWaId,
    };

    if (type === 'text') {
      payload.type = 'text';
      payload.text = { body: content.text };
    } else if (type === 'template') {
      payload.type = 'template';
      payload.template = {
        name: content.templateName,
        language: { code: content.templateLanguage || 'en' },
        components: content.templateComponents || [],
      };
    } else if (type === 'image') {
      payload.type = 'image';
      payload.image = { link: content.mediaUrl, caption: content.caption };
    } else if (type === 'document') {
      payload.type = 'document';
      payload.document = { link: content.mediaUrl, filename: content.filename, caption: content.caption };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (resData.error) {
        throw new Error(resData.error.message || 'Unknown Meta Cloud API error');
      }

      // Update message with Meta's wa_message_id
      await this.prisma.message.update({
        where: { id: messageId },
        data: {
          waMessageId: resData.messages?.[0]?.id,
          status: 'SENT',
        },
      });

      this.logger.log(`Successfully sent message ${messageId}. Meta ID: ${resData.messages?.[0]?.id}`);
      return resData;
    } catch (err: any) {
      this.logger.error(`Failed to send message ${messageId}: ${err.message}`);
      
      // Update status to FAILED in DB
      await this.prisma.message.update({
        where: { id: messageId },
        data: {
          status: 'FAILED',
          errorCode: 'META_SEND_ERROR',
          errorMessage: err.message,
        },
      });
      
      throw err; // Trigger BullMQ retry
    }
  }
}
