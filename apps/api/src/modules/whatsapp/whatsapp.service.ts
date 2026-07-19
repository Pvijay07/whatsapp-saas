import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import {
  QUEUE_NAMES,
  META_GRAPH_URL,
  isWithin24HourWindow,
} from '@whatsapp-platform/shared';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    @InjectQueue(QUEUE_NAMES.SEND_MESSAGE) private readonly sendQueue: Queue,
    @InjectQueue(QUEUE_NAMES.WEBHOOK_EVENTS) private readonly webhookQueue: Queue,
  ) {}

  // --- Embedded Signup ---

  async handleEmbeddedSignup(organizationId: string, code: string) {
    const appId = this.config.get('META_APP_ID');
    const appSecret = this.config.get('META_APP_SECRET');
    const apiVersion = this.config.get('META_API_VERSION', 'v21.0');

    // Exchange code for access token
    const tokenUrl = `${META_GRAPH_URL}/${apiVersion}/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&code=${code}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      throw new BadRequestException('Failed to exchange code for access token');
    }

    // Get WABA info
    const debugUrl = `${META_GRAPH_URL}/${apiVersion}/debug_token?input_token=${tokenData.access_token}&access_token=${appId}|${appSecret}`;
    const debugRes = await fetch(debugUrl);
    const debugData = await debugRes.json();

    const wabaId = debugData?.data?.granular_scopes?.find(
      (s: any) => s.scope === 'whatsapp_business_management',
    )?.target_ids?.[0];

    if (!wabaId) {
      throw new BadRequestException('No WABA ID found in granted scopes');
    }

    // Get phone numbers for this WABA
    const phonesUrl = `${META_GRAPH_URL}/${apiVersion}/${wabaId}/phone_numbers?access_token=${tokenData.access_token}`;
    const phonesRes = await fetch(phonesUrl);
    const phonesData = await phonesRes.json();

    const phoneNumbers = phonesData.data || [];

    // Store phone numbers
    const created = [];
    for (const phone of phoneNumbers) {
      const phoneNumber = await this.prisma.phoneNumber.upsert({
        where: {
          organizationId_phoneNumberId: {
            organizationId,
            phoneNumberId: phone.id,
          },
        },
        create: {
          organizationId,
          wabaId,
          phoneNumberId: phone.id,
          displayNumber: phone.display_phone_number,
          status: phone.verified_name ? 'ACTIVE' : 'PENDING',
          qualityRating: (phone.quality_rating || 'UNKNOWN').toUpperCase(),
          accessToken: tokenData.access_token,
        },
        update: {
          status: phone.verified_name ? 'ACTIVE' : 'PENDING',
          qualityRating: (phone.quality_rating || 'UNKNOWN').toUpperCase(),
          accessToken: tokenData.access_token,
        },
      });
      created.push(phoneNumber);
    }

    // Subscribe to webhooks
    await this.subscribeToWebhooks(wabaId, tokenData.access_token);

    return {
      wabaId,
      phoneNumbers: created.map((p) => ({
        id: p.id,
        displayNumber: p.displayNumber,
        status: p.status,
        qualityRating: p.qualityRating,
      })),
    };
  }

  private async subscribeToWebhooks(wabaId: string, accessToken: string) {
    const apiVersion = this.config.get('META_API_VERSION', 'v21.0');
    try {
      await fetch(
        `${META_GRAPH_URL}/${apiVersion}/${wabaId}/subscribed_apps`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
    } catch (error) {
      this.logger.warn(`Failed to subscribe to webhooks for WABA ${wabaId}: ${error}`);
    }
  }

  // --- Webhook Verification ---

  verifyWebhook(mode: string, token: string, challenge: string): string {
    const verifyToken = this.config.get('META_WEBHOOK_VERIFY_TOKEN');
    if (mode === 'subscribe' && token === verifyToken) {
      return challenge;
    }
    throw new BadRequestException('Webhook verification failed');
  }

  // --- Webhook Processing ---

  async processWebhookEvent(body: any) {
    // Enqueue for async processing to avoid Meta timeouts
    await this.webhookQueue.add('process', body, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
    });
    return { status: 'queued' };
  }

  // --- Send Message ---

  async sendMessage(
    organizationId: string,
    conversationId: string,
    type: string,
    content: Record<string, any>,
  ) {
    // Get conversation with contact and phone number
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, organizationId },
      include: {
        contact: true,
        phoneNumber: true,
      },
    });

    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }

    // Check 24-hour window for non-template messages
    if (type !== 'template' && !isWithin24HourWindow(conversation.lastCustomerMessageAt)) {
      throw new BadRequestException(
        'Outside the 24-hour session window. Only template messages can be sent.',
      );
    }

    // Create message record
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        direction: 'OUTBOUND',
        type: type.toUpperCase() as any,
        content,
        status: 'QUEUED',
        templateId: content.templateId || null,
      },
    });

    // Enqueue for sending
    await this.sendQueue.add(
      'send',
      {
        messageId: message.id,
        phoneNumberId: conversation.phoneNumber.phoneNumberId,
        accessToken: conversation.phoneNumber.accessToken,
        recipientWaId: conversation.contact.waId,
        type,
        content,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );

    return message;
  }

  // --- Template Sync ---

  async syncTemplates(organizationId: string) {
    const phoneNumbers = await this.prisma.phoneNumber.findMany({
      where: { organizationId, status: 'ACTIVE' },
    });

    if (!phoneNumbers.length) {
      throw new BadRequestException('No active phone numbers found');
    }

    const phone = phoneNumbers[0];
    const apiVersion = this.config.get('META_API_VERSION', 'v21.0');
    const url = `${META_GRAPH_URL}/${apiVersion}/${phone.wabaId}/message_templates?access_token=${phone.accessToken}`;

    const res = await fetch(url);
    const data = await res.json();

    const templates = data.data || [];
    const synced = [];

    for (const tpl of templates) {
      const template = await this.prisma.template.upsert({
        where: {
          organizationId_name_language: {
            organizationId,
            name: tpl.name,
            language: tpl.language,
          },
        },
        create: {
          organizationId,
          name: tpl.name,
          category: tpl.category.toUpperCase(),
          language: tpl.language,
          status: tpl.status === 'APPROVED' ? 'APPROVED' : tpl.status === 'REJECTED' ? 'REJECTED' : 'PENDING',
          metaTemplateId: tpl.id,
          components: tpl.components || [],
          rejectionReason: tpl.rejected_reason || null,
        },
        update: {
          status: tpl.status === 'APPROVED' ? 'APPROVED' : tpl.status === 'REJECTED' ? 'REJECTED' : 'PENDING',
          components: tpl.components || [],
          rejectionReason: tpl.rejected_reason || null,
        },
      });
      synced.push(template);
    }

    return { synced: synced.length, templates: synced };
  }

  // --- Get Phone Numbers ---

  async getPhoneNumbers(organizationId: string) {
    return this.prisma.phoneNumber.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
