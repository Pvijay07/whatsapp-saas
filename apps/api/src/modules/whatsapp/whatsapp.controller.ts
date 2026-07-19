import { Controller, Post, Get, Body, Query, Req, UseGuards, RawBodyRequest } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('whatsapp')
@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  // --- Embedded Signup callback ---
  @Post('connect')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Handle Embedded Signup OAuth callback' })
  async connect(@Req() req: any, @Body() body: { code: string }) {
    return this.whatsappService.handleEmbeddedSignup(
      req.user.organizationId,
      body.code,
    );
  }

  // --- Webhook verification (GET) ---
  @Get('webhook')
  @ApiOperation({ summary: 'Meta webhook verification endpoint' })
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    return this.whatsappService.verifyWebhook(mode, token, challenge);
  }

  // --- Webhook events (POST) ---
  @Post('webhook')
  @ApiOperation({ summary: 'Receive Meta webhook events' })
  async handleWebhook(@Body() body: any) {
    return this.whatsappService.processWebhookEvent(body);
  }

  // --- Phone numbers ---
  @Get('phone-numbers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get connected phone numbers' })
  async getPhoneNumbers(@Req() req: any) {
    return this.whatsappService.getPhoneNumbers(req.user.organizationId);
  }

  // --- Template sync ---
  @Post('templates/sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync templates from Meta Cloud API' })
  async syncTemplates(@Req() req: any) {
    return this.whatsappService.syncTemplates(req.user.organizationId);
  }
}
