import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { QUEUE_NAMES } from '@whatsapp-platform/shared';

@Processor(QUEUE_NAMES.WEBHOOK_EVENTS)
export class WebhookProcessor extends WorkerHost {
  private readonly logger = new Logger(WebhookProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    const payload = job.data;
    this.logger.log(`Processing inbound webhook event job...`);

    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    if (!value) return;

    const phoneNumberId = value.metadata?.phone_number_id;
    if (!phoneNumberId) return;

    // Find PhoneNumber config in organization
    const phoneRecord = await this.prisma.phoneNumber.findFirst({
      where: { phoneNumberId },
    });

    if (!phoneRecord) {
      this.logger.warn(`Received webhook for unknown phone_number_id: ${phoneNumberId}`);
      return;
    }

    const organizationId = phoneRecord.organizationId;

    // 1. Process Inbound Messages
    if (value.messages && value.messages.length > 0) {
      for (const msg of value.messages) {
        await this.handleInboundMessage(organizationId, phoneRecord.id, value.contacts?.[0], msg);
      }
    }

    // 2. Process Outbound Message Status Updates
    if (value.statuses && value.statuses.length > 0) {
      for (const status of value.statuses) {
        await this.handleMessageStatusUpdate(status);
      }
    }
  }

  private async handleInboundMessage(
    organizationId: string,
    phoneRecordId: string,
    webhookContact: any,
    msg: any,
  ) {
    const waId = msg.from; // Sender's phone number
    const waMessageId = msg.id;

    // Idempotency: check if message already processed
    const existingMsg = await this.prisma.message.findUnique({
      where: { waMessageId },
    });
    if (existingMsg) {
      this.logger.log(`Duplicate webhook event: message ${waMessageId} already processed.`);
      return;
    }

    // Upsert Contact
    const contact = await this.prisma.contact.upsert({
      where: {
        organizationId_waId: { organizationId, waId },
      },
      create: {
        organizationId,
        waId,
        name: webhookContact?.profile?.name || 'WhatsApp Contact',
        optedIn: true, // Auto opt-in on incoming message
        optedInAt: new Date(),
        optedInSource: 'Inbound Message',
        lastMessageAt: new Date(),
      },
      update: {
        name: webhookContact?.profile?.name || undefined,
        lastMessageAt: new Date(),
      },
    });

    // Upsert Conversation
    const conversation = await this.prisma.conversation.upsert({
      where: {
        organizationId_contactId_phoneNumberId: {
          organizationId,
          contactId: contact.id,
          phoneNumberId: phoneRecordId,
        },
      },
      create: {
        organizationId,
        contactId: contact.id,
        phoneNumberId: phoneRecordId,
        status: 'OPEN',
        lastCustomerMessageAt: new Date(),
        unreadCount: 1,
      },
      update: {
        lastCustomerMessageAt: new Date(),
        unreadCount: { increment: 1 },
        status: 'OPEN', // Re-open if resolved/pending
      },
    });

    // Build message content JSON
    let content: any = {};
    let type = 'TEXT';

    if (msg.type === 'text') {
      type = 'TEXT';
      content = { text: msg.text.body };
    } else if (msg.type === 'image') {
      type = 'IMAGE';
      content = { mediaId: msg.image.id, mimeType: msg.image.mime_type, caption: msg.image.caption };
    } else if (msg.type === 'document') {
      type = 'DOCUMENT';
      content = { mediaId: msg.document.id, mimeType: msg.document.mime_type, filename: msg.document.filename, caption: msg.document.caption };
    } else {
      type = msg.type.toUpperCase();
      content = { raw: msg[msg.type] };
    }

    // Create Message record
    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: 'INBOUND',
        waMessageId,
        type: type as any,
        content,
        status: 'READ', // Inbound messages are stored directly
      },
    });

    this.logger.log(`Successfully ingested inbound message ${waMessageId} for conversation ${conversation.id}`);
  }

  private async handleMessageStatusUpdate(status: any) {
    const waMessageId = status.id;
    const statusMap: Record<string, string> = {
      sent: 'SENT',
      delivered: 'DELIVERED',
      read: 'READ',
      failed: 'FAILED',
    };

    const localStatus = statusMap[status.status];
    if (!localStatus) return;

    const updateData: any = { status: localStatus as any };

    if (status.errors && status.errors.length > 0) {
      updateData.errorCode = status.errors[0].code.toString();
      updateData.errorMessage = status.errors[0].message;
    }

    try {
      await this.prisma.message.update({
        where: { waMessageId },
        data: updateData,
      });
      this.logger.log(`Updated status of message ${waMessageId} to ${localStatus}`);
    } catch (err: any) {
      // Message might not exist yet if webhook status came before our response returned
      this.logger.warn(`Could not update status for message ${waMessageId}: ${err.message}`);
    }
  }
}
