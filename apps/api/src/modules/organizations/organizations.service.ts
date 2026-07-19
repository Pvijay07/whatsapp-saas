import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        plan: true,
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  async updateProfile(organizationId: string, data: { name?: string; timezone?: string }) {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data,
    });
  }

  async getMembers(organizationId: string) {
    return this.prisma.organizationMember.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            isActive: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
  }

  async inviteMember(organizationId: string, email: string, role: 'OWNER' | 'AGENT', actorId: string) {
    // Check if actor is OWNER
    const actorMember = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: actorId,
        },
      },
    });

    if (!actorMember || actorMember.role !== 'OWNER') {
      throw new ForbiddenException('Only owners can invite new members');
    }

    // Check if user already exists
    let user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Create user with dummy password that they must reset, or invite placeholder
      // For MVP, we'll create a simple placeholder user (normally we'd send invite email)
      const bcrypt = require('bcrypt');
      const randomPassword = Math.random().toString(36).substring(2, 10);
      const passwordHash = await bcrypt.hash(randomPassword, 12);
      
      user = await this.prisma.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          firstName: 'Invited',
          lastName: 'User',
        },
      });
    }

    // Check if already a member
    const existingMember = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this organization');
    }

    return this.prisma.organizationMember.create({
      data: {
        organizationId,
        userId: user.id,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }
}

import { ConflictException } from '@nestjs/common';
