import { Controller, Get, Patch, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';

export class UpdateOrgDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  timezone?: string;
}

export class InviteMemberDto {
  @IsEmail()
  email: string;

  @IsEnum(['OWNER', 'AGENT'])
  role: 'OWNER' | 'AGENT';
}

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current organization details' })
  async getCurrentOrg(@Req() req: any) {
    return this.orgService.getProfile(req.user.organizationId);
  }

  @Patch('current')
  @ApiOperation({ summary: 'Update current organization details' })
  async updateCurrentOrg(@Req() req: any, @Body() body: UpdateOrgDto) {
    return this.orgService.updateProfile(req.user.organizationId, body);
  }

  @Get('members')
  @ApiOperation({ summary: 'List all team members' })
  async getMembers(@Req() req: any) {
    return this.orgService.getMembers(req.user.organizationId);
  }

  @Post('members/invite')
  @ApiOperation({ summary: 'Invite a new team member' })
  async inviteMember(@Req() req: any, @Body() body: InviteMemberDto) {
    return this.orgService.inviteMember(
      req.user.organizationId,
      body.email,
      body.role,
      req.user.userId,
    );
  }
}
