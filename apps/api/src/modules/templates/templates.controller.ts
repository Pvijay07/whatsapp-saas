import { Controller, Get, Post, Delete, Body, Query, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTemplateDto } from '@whatsapp-platform/shared';

@ApiTags('templates')
@Controller('templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new template to Meta' })
  async create(@Req() req: any, @Body() body: CreateTemplateDto) {
    return this.templatesService.create(req.user.organizationId, body);
  }

  @Get()
  @ApiOperation({ summary: 'List all organization templates' })
  async findAll(
    @Req() req: any,
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    return this.templatesService.findAll(req.user.organizationId, category, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a template details' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.templatesService.findOne(req.user.organizationId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a template (locally and from Meta)' })
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.templatesService.delete(req.user.organizationId, id);
  }
}
