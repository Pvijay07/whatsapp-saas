import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConversationsGateway } from './conversations.gateway';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { SendMessageDto } from '@whatsapp-platform/shared';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: ConversationsGateway,
    @Inject(forwardRef(() => WhatsappService))
    private readonly whatsappService: WhatsappService,
  ) {}

  async findAll(
    organizationId: string,
    params: {
      status?: 'OPEN' | 'PENDING' | 'RESOLVED';
      assignedAgentId?: string | null;
      page?: number;
      limit?: number;
    },
  ) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { organizationId };

    if (params.status) {
      where.status = params.status;
    }

    if (params.assignedAgentId !== undefined) {
      where.assignedAgentId = params.assignedAgentId === 'null' ? null : params.assignedAgentId;
    }

    const [data, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        skip,
        take: limit,
        include: {
          contact: {
            include: {
              tags: {
                include: {
                  tag: true,
                },
              },
            },
          },
          phoneNumber: true,
          assignedAgent: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.conversation.count({ where }),
    ]);

    return {
      data: data.map(conv => ({
        ...conv,
        contact: {
          ...conv.contact,
          tags: conv.contact.tags.map(t => t.tag),
        },
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
    const conv = await this.prisma.conversation.findFirst({
      where: { id, organizationId },
      include: {
        contact: {
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
        },
        phoneNumber: true,
        assignedAgent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    return {
      ...conv,
      contact: {
        ...conv.contact,
        tags: conv.contact.tags.map(t => t.tag),
      },
    };
  }

  async getMessages(organizationId: string, conversationId: string, page = 1, limit = 50) {
    // Verify conversation
    await this.findOne(organizationId, conversationId);

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.message.count({ where: { conversationId } }),
    ]);

    return {
      data: data.reverse(), // Return oldest first for chat flow
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async sendMessage(organizationId: string, conversationId: string, dto: SendMessageDto) {
    // Delegates actual queue enqueuing and Meta payload compilation to WhatsappService
    const msg = await this.whatsappService.sendMessage(
      organizationId,
      conversationId,
      dto.type,
      dto.content,
    );

    // Notify other agents in dashboard real-time
    this.gateway.emitToOrg(organizationId, 'message_created', msg);

    return msg;
  }

  async assignAgent(organizationId: string, conversationId: string, agentId: string | null) {
    const conv = await this.findOne(organizationId, conversationId);

    if (agentId) {
      // Verify agent exists and belongs to organization
      const member = await this.prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId: agentId,
          },
        },
      });

      if (!member) {
        throw new BadRequestException('User is not a member of this organization');
      }
    }

    const updated = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { assignedAgentId: agentId },
      include: {
        assignedAgent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Notify agents of assignment update
    this.gateway.emitToOrg(organizationId, 'conversation_updated', updated);

    return updated;
  }

  async updateStatus(
    organizationId: string,
    conversationId: string,
    status: 'OPEN' | 'PENDING' | 'RESOLVED',
  ) {
    await this.findOne(organizationId, conversationId);

    const updated = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
    });

    this.gateway.emitToOrg(organizationId, 'conversation_updated', updated);

    return updated;
  }
}
