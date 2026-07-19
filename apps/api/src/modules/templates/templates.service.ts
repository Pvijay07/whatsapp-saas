import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTemplateDto, META_GRAPH_URL } from '@whatsapp-platform/shared';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TemplatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async create(organizationId: string, dto: CreateTemplateDto) {
    // 1. Verify organization has a connected phone number
    const phone = await this.prisma.phoneNumber.findFirst({
      where: { organizationId, status: 'ACTIVE' },
    });

    if (!phone) {
      throw new BadRequestException('No active WhatsApp phone number connected to submit templates');
    }

    // 2. Submit to Meta Business Manager API (WABA)
    const apiVersion = this.config.get('META_API_VERSION', 'v21.0');
    const url = `${META_GRAPH_URL}/${apiVersion}/${phone.wabaId}/message_templates?access_token=${phone.accessToken}`;

    // Format components to match Meta's API payload requirements
    const metaPayload = {
      name: dto.name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      category: dto.category,
      language: dto.language,
      components: dto.components,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metaPayload),
      });

      const resData = await response.json();

      if (resData.error) {
        throw new BadRequestException(`Meta API Error: ${resData.error.message}`);
      }

      // 3. Save locally in PENDING status
      return this.prisma.template.create({
        data: {
          organizationId,
          name: metaPayload.name,
          category: dto.category,
          language: dto.language,
          status: 'PENDING',
          metaTemplateId: resData.id,
          components: dto.components as any,
        },
      });
    } catch (err) {
      throw new BadRequestException(`Failed to submit template to Meta: ${err.message}`);
    }
  }

  async findAll(organizationId: string, category?: string, status?: string) {
    const where: any = { organizationId };
    if (category) where.category = category;
    if (status) where.status = status;

    return this.prisma.template.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    const template = await this.prisma.template.findFirst({
      where: { id, organizationId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async delete(organizationId: string, id: string) {
    const template = await this.findOne(organizationId, id);

    const phone = await this.prisma.phoneNumber.findFirst({
      where: { organizationId, status: 'ACTIVE' },
    });

    if (phone && template.metaTemplateId) {
      const apiVersion = this.config.get('META_API_VERSION', 'v21.0');
      const url = `${META_GRAPH_URL}/${apiVersion}/${phone.wabaId}/message_templates?name=${template.name}&access_token=${phone.accessToken}`;
      
      try {
        await fetch(url, { method: 'DELETE' });
      } catch (err) {
        // Log error but proceed with local deletion
        console.error('Failed to delete template from Meta WABA:', err.message);
      }
    }

    return this.prisma.template.delete({
      where: { id },
    });
  }
}
