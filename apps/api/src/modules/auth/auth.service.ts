import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { slugify } from '@whatsapp-platform/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName: string;
    timezone?: string;
  }) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const slug = slugify(dto.organizationName) + '-' + Date.now().toString(36);

    // Create user + org + membership in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: dto.organizationName,
          slug,
          timezone: dto.timezone || 'UTC',
        },
      });

      const user = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      await tx.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          role: 'OWNER',
        },
      });

      // Create default pipeline for CRM
      const pipeline = await tx.pipeline.create({
        data: {
          organizationId: organization.id,
          name: 'Sales Pipeline',
          isDefault: true,
        },
      });

      await tx.pipelineStage.createMany({
        data: [
          { pipelineId: pipeline.id, name: 'Lead', color: '#6c7a75', position: 0 },
          { pipelineId: pipeline.id, name: 'Qualified', color: '#FAB534', position: 1 },
          { pipelineId: pipeline.id, name: 'Proposal', color: '#05a68b', position: 2 },
          { pipelineId: pipeline.id, name: 'Negotiation', color: '#006b59', position: 3 },
          { pipelineId: pipeline.id, name: 'Won', color: '#10B981', position: 4 },
          { pipelineId: pipeline.id, name: 'Lost', color: '#EF4444', position: 5 },
        ],
      });

      return { user, organization };
    });

    const token = this.generateToken(result.user.id, result.organization.id);

    return {
      accessToken: token,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        avatarUrl: result.user.avatarUrl,
      },
      organization: {
        id: result.organization.id,
        name: result.organization.name,
        slug: result.organization.slug,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        memberships: {
          include: { organization: true },
          where: { isActive: true },
          take: 1,
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const membership = user.memberships[0];
    if (!membership) {
      throw new UnauthorizedException('No active organization membership');
    }

    const token = this.generateToken(user.id, membership.organizationId);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
      },
      organization: {
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
      },
    };
  }

  async getProfile(userId: string, organizationId: string) {
    const member = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: { organizationId, userId },
      },
      include: {
        user: true,
        organization: {
          include: {
            plan: true,
            phoneNumbers: { where: { status: 'ACTIVE' } },
          },
        },
      },
    });

    if (!member) {
      throw new UnauthorizedException('Not a member of this organization');
    }

    return {
      user: {
        id: member.user.id,
        email: member.user.email,
        firstName: member.user.firstName,
        lastName: member.user.lastName,
        avatarUrl: member.user.avatarUrl,
        role: member.role,
      },
      organization: {
        id: member.organization.id,
        name: member.organization.name,
        slug: member.organization.slug,
        timezone: member.organization.timezone,
        plan: member.organization.plan,
        phoneNumbers: member.organization.phoneNumbers.map((p) => ({
          id: p.id,
          displayNumber: p.displayNumber,
          status: p.status,
          qualityRating: p.qualityRating,
        })),
      },
    };
  }

  private generateToken(userId: string, organizationId: string): string {
    return this.jwtService.sign({
      sub: userId,
      orgId: organizationId,
    });
  }
}
