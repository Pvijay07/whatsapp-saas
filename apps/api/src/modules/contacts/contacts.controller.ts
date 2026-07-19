import { Controller, Get, Post, Patch, Delete, Body, Query, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateContactDto, UpdateContactDto } from '@whatsapp-platform/shared';
import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryContactsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  optedIn?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  tagIds?: string[];

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}

@ApiTags('contacts')
@Controller('contacts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  async create(@Req() req: any, @Body() body: CreateContactDto) {
    return this.contactsService.create(req.user.organizationId, body);
  }

  @Get()
  @ApiOperation({ summary: 'List all contacts (paginated, filterable)' })
  async findAll(@Req() req: any, @Query() query: QueryContactsDto) {
    return this.contactsService.findAll(req.user.organizationId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contact details' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.contactsService.findOne(req.user.organizationId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact details' })
  async update(@Req() req: any, @Param('id') id: string, @Body() body: UpdateContactDto) {
    return this.contactsService.update(req.user.organizationId, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact' })
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.contactsService.delete(req.user.organizationId, id);
  }

  @Post(':id/tags/:tagId')
  @ApiOperation({ summary: 'Add a tag to a contact' })
  async addTag(@Req() req: any, @Param('id') id: string, @Param('tagId') tagId: string) {
    return this.contactsService.addTag(req.user.organizationId, id, tagId);
  }

  @Delete(':id/tags/:tagId')
  @ApiOperation({ summary: 'Remove a tag from a contact' })
  async removeTag(@Req() req: any, @Param('id') id: string, @Param('tagId') tagId: string) {
    return this.contactsService.removeTag(req.user.organizationId, id, tagId);
  }
}
