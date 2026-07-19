import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed script...');

  const email = 'demo@aura.com';
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 12);

  // 1. Create or update user
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      firstName: 'Aura',
      lastName: 'Admin',
    },
  });
  console.log(`👤 User created/updated: ${user.email} (Password: ${password})`);

  // 2. Create organization
  let org = await prisma.organization.findFirst({
    where: { members: { some: { userId: user.id } } },
  });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: 'Aura Demo Corp',
        slug: 'aura-demo',
        timezone: 'UTC',
      },
    });
    console.log(`🏢 Organization created: ${org.name}`);

    // 3. Create member link
    await prisma.organizationMember.create({
      data: {
        organizationId: org.id,
        userId: user.id,
        role: 'OWNER',
      },
    });
  }

  // 4. Create default CRM Pipeline & Stages
  let pipeline = await prisma.pipeline.findFirst({
    where: { organizationId: org.id },
  });

  if (!pipeline) {
    pipeline = await prisma.pipeline.create({
      data: {
        organizationId: org.id,
        name: 'Sales Pipeline',
        isDefault: true,
      },
    });

    const stages = [
      { name: 'Lead', color: '#6c7a75', position: 1 },
      { name: 'Qualified', color: '#FAB534', position: 2 },
      { name: 'Proposal', color: '#0ea5e9', position: 3 },
      { name: 'Negotiation', color: '#4f46e5', position: 4 },
      { name: 'Won', color: '#10B981', position: 5 },
      { name: 'Lost', color: '#EF4444', position: 6 },
    ];

    for (const stage of stages) {
      await prisma.pipelineStage.create({
        data: {
          pipelineId: pipeline.id,
          name: stage.name,
          color: stage.color,
          position: stage.position,
        },
      });
    }
    console.log('📊 CRM stages seeded successfully.');
  }

  // 5. Create default Phone Number Config
  let phoneRecord = await prisma.phoneNumber.findFirst({
    where: { organizationId: org.id },
  });

  if (!phoneRecord) {
    phoneRecord = await prisma.phoneNumber.create({
      data: {
        organizationId: org.id,
        phoneNumberId: '15550192834',
        wabaId: 'waba_demo_123',
        displayNumber: '+1 (555) 019-2834',
        status: 'ACTIVE',
      },
    });
    console.log(`📞 Phone Number seeded: +${phoneRecord.phoneNumberId}`);
  }

  // 6. Create default Contacts
  const existingContact = await prisma.contact.findFirst({
    where: { organizationId: org.id },
  });

  if (!existingContact) {
    const contact = await prisma.contact.create({
      data: {
        organizationId: org.id,
        waId: '15550198822',
        name: 'Sophia Martinez',
        email: 'sophia@retailmax.com',
        optedIn: true,
        optedInAt: new Date(),
        optedInSource: 'Manual',
        lastMessageAt: new Date(),
      },
    });
    console.log(`👤 Contact seeded: ${contact.name}`);

    // Create a conversation for the contact
    const conversation = await prisma.conversation.create({
      data: {
        organizationId: org.id,
        contactId: contact.id,
        phoneNumberId: phoneRecord.id,
        status: 'OPEN',
        unreadCount: 1,
        lastCustomerMessageAt: new Date(),
      },
    });

    // Create a message in the conversation
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: 'INBOUND',
        waMessageId: 'wa_msg_init_99',
        type: 'TEXT',
        content: { text: 'Hello! I need a demo walkthrough of the Aura platform, please.' },
        status: 'READ',
        createdAt: new Date(),
      },
    });
    console.log('💬 Initial Chat Inbound message seeded.');
  }

  console.log('🎉 Seed script completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
