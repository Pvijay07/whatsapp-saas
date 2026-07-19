import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { BroadcastsModule } from './modules/broadcasts/broadcasts.module';
import { TagsModule } from './modules/tags/tags.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AutomationModule } from './modules/automation/automation.module';
import { AiModule } from './modules/ai/ai.module';
import { CrmModule } from './modules/crm/crm.module';
import { AuditModule } from './modules/audit/audit.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_URL
          ? new URL(process.env.REDIS_URL).hostname
          : 'localhost',
        port: process.env.REDIS_URL
          ? parseInt(new URL(process.env.REDIS_URL).port || '6379')
          : 6379,
      },
    }),
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    WhatsappModule,
    ContactsModule,
    ConversationsModule,
    TemplatesModule,
    BroadcastsModule,
    TagsModule,
    AnalyticsModule,
    AutomationModule,
    AiModule,
    CrmModule,
    AuditModule,
  ],
})
export class AppModule {}
