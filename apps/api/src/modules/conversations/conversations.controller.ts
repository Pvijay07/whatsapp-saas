import { Controller, Get, Post, Patch, Body, Query, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SendMessageDto } from '@whatsapp-platform/shared';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryConversationsDto {
  @IsOptional()
  @IsEnum(['OPEN', 'PENDING', 'RESOLVED'])
  status?: 'OPEN' | 'PENDING' | 'RESOLVED';

  @IsOptional()
  @IsString()
  assignedAgentId?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}

export class AssignAgentDto {
  @IsOptional()
  @IsString()
  agentId: string | null;
}

export class UpdateStatusDto {
  @IsEnum(['OPEN', 'PENDING', 'RESOLVED'])
  status: 'OPEN' | 'PENDING' | 'RESOLVED';
}

@ApiTags('conversations')
@Controller('conversations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ConversationsController {
  constructor(private readonly convService: ConversationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of conversations (paginated, filtered)' })
  async findAll(@Req() req: any, @Query() query: QueryConversationsDto) {
    return this.convService.findAll(req.user.organizationId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single conversation details' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.convService.findOne(req.user.organizationId, id);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get paginated message history for a conversation' })
  async getMessages(
    @Req() req: any,
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.convService.getMessages(req.user.organizationId, id, page, limit);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message' })
  async sendMessage(@Req() req: any, @Param('id') id: string, @Body() body: SendMessageDto) {
    return this.convService.sendMessage(req.user.organizationId, id, body);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign conversation to an agent' })
  async assignAgent(@Req() req: any, @Param('id') id: string, @Body() body: AssignAgentDto) {
    return this.convService.assignAgent(req.user.organizationId, id, body.agentId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update conversation status' })
  async updateStatus(@Req() req: any, @Param('id') id: string, @Body() body: UpdateStatusDto) {
    return this.convService.updateStatus(req.user.organizationId, id, body.status);
  }
}
