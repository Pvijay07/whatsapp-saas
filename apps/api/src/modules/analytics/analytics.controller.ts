import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class QueryAnalyticsDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  days?: number;
}

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get general KPIs' })
  async getOverview(@Req() req: any, @Query() query: QueryAnalyticsDto) {
    return this.analyticsService.getOverview(req.user.organizationId, query.days);
  }

  @Get('daily')
  @ApiOperation({ summary: 'Get message volume daily distribution' })
  async getDailyVolume(@Req() req: any, @Query() query: QueryAnalyticsDto) {
    return this.analyticsService.getDailyVolume(req.user.organizationId, query.days);
  }

  @Get('agents')
  @ApiOperation({ summary: 'Get team performance metrics' })
  async getAgents(@Req() req: any) {
    return this.analyticsService.getAgentPerformance(req.user.organizationId);
  }
}
