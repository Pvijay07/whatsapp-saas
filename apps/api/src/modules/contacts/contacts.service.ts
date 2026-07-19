import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateContactDto, UpdateContactDto } from '@whatsapp-platform/shared';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateContactDto) {
    // Clean phone number: remove non-digits, check E.164-ish format
    const cleanedWaId = dto.waId.replace(/\D/g, '');
    if (!cleanedWaId) {
      throw new ConflictException('Invalid phone number format');
    }

    const existing = await this.prisma.contact.findUnique({
      where: {
        organizationId_waId: {
          organizationId,
          waId: cleanedWaId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Contact with this WhatsApp ID already exists');
    }

    return this.prisma.contact.create({
      data: {
        organizationId,
        waId: cleanedWaId,
        name: dto.name || null,
        email: dto.email || null,
        optedIn: dto.optedIn ?? false,
        optedInAt: dto.optedIn ? new Date() : null,
        optedInSource: dto.optedInSource || null,
      },
    });
  }

  async findAll(
    organizationId: string,
    params: {
      page?: number;
      limit?: number;
      search?: string;
      optedIn?: boolean;
      tagIds?: string[];
    },
  ) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { organizationId };

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { waId: { contains: params.search } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.optedIn !== undefined) {
      where.optedIn = params.optedIn;
    }

    if (params.tagIds && params.tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: { in: params.tagIds },
        },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip,
        take: limit,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contact.count({ where }),
    ]);

    return {
      data: data.map(contact => ({
        ...contact,
        tags: contact.tags.map(t => t.tag),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(organizationId: string, id: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id, organizationId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        customFieldValues: {
          include: {
            customField: true,
          },
        },
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return {
      ...contact,
      tags: contact.tags.map(t => t.tag),
    };
  }

  async update(organizationId: string, id: string, dto: UpdateContactDto) {
    const contact = await this.findOne(organizationId, id);

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.email !== undefined) updateData.email = dto.email;
    
    if (dto.optedIn !== undefined) {
      updateData.optedIn = dto.optedIn;
      if (dto.optedIn && !contact.optedIn) {
        updateData.optedInAt = new Date();
        updateData.optedInSource = dto.optedInSource || 'Manual';
      } else if (!dto.optedIn) {
        updateData.optedInAt = null;
        updateData.optedInSource = null;
      }
    }

    return this.prisma.contact.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(organizationId: string, id: string) {
    await this.findOne(organizationId, id);
    return this.prisma.contact.delete({
      where: { id },
    });
  }

  // --- Tagging ---

  async addTag(organizationId: string, contactId: string, tagId: string) {
    await this.findOne(organizationId, contactId);

    // Verify tag belongs to organization
    const tag = await this.prisma.tag.findFirst({
      where: { id: tagId, organizationId },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return this.prisma.contactTag.upsert({
      where: {
        contactId_tagId: { contactId, tagId },
      },
      create: { contactId, tagId },
      update: {},
    });
  }

  async removeTag(organizationId: string, contactId: string, tagId: string) {
    await this.findOne(organizationId, contactId);

    return this.prisma.contactTag.delete({
      where: {
        contactId_tagId: { contactId, tagId },
      },
    });
  }
}
