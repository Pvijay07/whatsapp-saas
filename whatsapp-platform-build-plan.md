# WhatsApp Business Platform — Workable Build Plan

A revised version of the original architecture doc, adjusted for what actually ships. The core idea (WhatsApp-first, omnichannel-ready) is right. Three things were wrong enough to sink a real build: the timeline, the microservices-from-day-one architecture, and the missing operational realities of the Meta Cloud API.

---

## What changed and why

| Original | Problem | Fix |
|---|---|---|
| 6–8 week MVP with 9 modules (auth, multi-tenant, inbox, contacts, templates, roles, assignment, analytics) | This is 3–4 months of work for a small team, not 6–8 weeks. Underestimating this is the #1 reason these projects stall. | MVP redefined to the smallest thing that lets one business team message customers. Realistic timeline: 10–12 weeks for a 2–3 person team. |
| "Suggested Microservices" (13 services) from the start | You will spend more time on service discovery, distributed tracing, and inter-service auth than on product. Nobody needs 13 services at 0 customers. | Start as a modular monolith (NestJS with clean module boundaries). Extract services only when a specific module has a scaling or team-ownership reason to split — usually WhatsApp webhook ingestion first, AI second. |
| No mention of Meta's approval process | This is the actual critical path. Business verification, phone number registration, and template approval can take days to weeks and are outside your control. | Added as Phase 0, before any code. |
| Tables listed with no fields | Can't be handed to an engineer or an AI coding tool as-is. | Core tables given real columns below. |
| No mention of WhatsApp policy limits (24-hour session window, template categories, rate tiers, opt-in requirements) | These aren't optional — they shape your data model and messaging flow. Building broadcast/campaign features without them means rework. | Added as a dedicated section. |

---

## Phase 0 — Before You Write Code (1–2 weeks, runs in parallel with setup)

This is the part most plans skip, and it's what actually gates your launch date:

1. **Meta Business Verification** — register a Meta Business Account, verify the business (documents, sometimes a phone call). Can take days to a couple of weeks.
2. **WhatsApp Business Account (WABA) + phone number** — register at least one test number in the Meta Cloud API. You need this working before you build anything else, because every other module depends on it.
3. **Message template pre-approval** — submit 2–3 templates (e.g., a welcome message, an OTP-style template) so you have something approved to test sending with. Templates get rejected for vague reasons; budget resubmission time.
4. **Decide: Cloud API direct, or through a BSP?** Meta's own Cloud API is free-ish (you pay Meta's conversation-based pricing) but you own all infra. A Business Solution Provider (e.g., a Meta tech partner) can simplify onboarding but adds a markup and a dependency. Most serious platforms go direct to Cloud API — but confirm this before architecting webhooks.

If you skip this phase and start with "Phase 1" coding, you'll finish your inbox UI and have nowhere to send a message.

---

## Revised Module Priority for MVP

Not all 20+ modules from the original list are MVP. Here's what a business actually needs to go live with WhatsApp messaging, in build order:

**True MVP (must exist to launch):**
- Auth + single-organization support (multi-tenant *data model* yes, multi-tenant *UI/billing* no — you can hardcode plan limits at first)
- WhatsApp Cloud API connection (webhook receive + send)
- Contacts
- Conversations / Team Inbox (single inbox, manual assignment is fine — round robin can wait)
- Message templates (create, submit to Meta, track approval status)
- Basic roles (Owner, Agent — skip the 6-tier hierarchy for now)

**Fast-follow (weeks 3–5 after MVP):**
- Broadcasts (with opt-in + 24-hour window enforcement — see below)
- Tags, notes, canned responses
- Basic analytics (messages sent/delivered/read, response time)

**Defer until you have paying customers asking for them:**
- Automation/workflow builder
- AI reply suggestions
- CRM pipelines
- Multi-channel (Instagram, Messenger, etc.)
- White-label, SSO/SCIM, partner portal

This isn't about ambition — the automation builder and AI agent alone are each larger than the entire MVP above. Sequence them after revenue, not before.

---

## Realistic Roadmap

### Phase 0 — Meta setup & compliance (1–2 weeks, parallel)
As above.

### Phase 1 — MVP (10–12 weeks, 2–3 engineers)
- Auth, single-org data model
- WhatsApp webhook ingestion (receive, store, idempotency handling — Meta *will* send duplicate webhooks)
- Send flow via queue (never send synchronously from an API request — Meta rate-limits and you need retry logic)
- Team inbox: conversation list, assignment, reply
- Contacts (auto-created from inbound messages)
- Templates: create, submit, poll/receive approval status via webhook
- Roles: Owner, Agent
- Minimal analytics: sent/delivered/read/failed counts

### Phase 2 — Retention features (6–8 weeks)
- Broadcasts with opt-in tracking and batch rate-limited sending
- Campaign scheduling
- Tags, custom fields, canned responses, internal notes
- Routing: round robin / least-busy (skip VIP/language routing until asked for)
- Billing: plan limits enforced (seats, numbers, messages/month)

### Phase 3 — Differentiation (2–3 months)
- Automation builder (start with linear "if this, then that" flows before a full node graph — the node-based visual builder is a project on its own)
- AI reply suggestions (start with "suggest only," never auto-send — human approval mode first)
- CRM pipeline
- Public API + webhooks for customers
- Mobile app (React Native, wraps the inbox + notifications only, not full feature parity)

### Phase 4 — Enterprise (ongoing, as sales requires it)
- Omnichannel (Instagram/Messenger via Meta's unified messaging APIs, since they share infrastructure with WhatsApp Cloud API)
- White-label
- SSO/SCIM
- Multi-region deployment

---

## Architecture: Start as a Modular Monolith

```
apps/
  api/                 ← single NestJS app, organized by domain module
    modules/
      auth/
      organizations/
      contacts/
      conversations/
      whatsapp/         ← webhook handling, send queue, template sync
      billing/
      analytics/
    main.ts
  worker/               ← separate process, same codebase, consumes BullMQ queues
    processors/
      send-message.processor.ts
      webhook.processor.ts
      broadcast.processor.ts
  web/                  ← Next.js dashboard

packages/
  database/             ← Prisma or Drizzle schema, shared types
  shared/                ← DTOs, constants, WhatsApp payload types
```

Two deployable units (API + worker), one codebase, one database. This gets you 90% of the operational benefit of microservices (independent scaling of the webhook/send pipeline) without the cost of distributed systems. Split `whatsapp` and `ai` into real services later, specifically when:
- The webhook volume needs independent scaling from the dashboard API, or
- A separate team owns AI and needs to deploy independently.

Until one of those is true, extra services are pure overhead.

---

## Core Schema (with actual fields, not just table names)

```sql
organizations (
  id, name, slug, plan_id, created_at,
  meta_business_id, timezone
)

phone_numbers (
  id, organization_id, waba_id, phone_number_id (Meta's),
  display_number, status (pending|approved|disabled), quality_rating
)

contacts (
  id, organization_id, wa_id (phone in E.164), name,
  opted_in boolean, opted_in_at, last_message_at, created_at
)

conversations (
  id, organization_id, contact_id, phone_number_id,
  assigned_agent_id, status (open|pending|resolved),
  last_customer_message_at,   -- critical: drives the 24h session window
  unread_count, created_at
)

messages (
  id, conversation_id, direction (inbound|outbound),
  wa_message_id, type (text|template|image|document|...),
  content jsonb, status (queued|sent|delivered|read|failed),
  template_id nullable, created_at
)

templates (
  id, organization_id, name, category (marketing|utility|authentication),
  language, status (pending|approved|rejected), meta_template_id,
  components jsonb, rejection_reason nullable
)

broadcasts (
  id, organization_id, template_id, audience_filter jsonb,
  status (draft|scheduled|sending|completed),
  total_recipients, sent_count, failed_count, scheduled_at
)
```

The `last_customer_message_at` field on `conversations` isn't decorative — it's what determines whether you're inside WhatsApp's 24-hour free-form messaging window or need to use a paid, pre-approved template to reach the customer. Get this wrong and messages silently fail.

---

## WhatsApp Policy Constraints That Shape the Product

These aren't edge cases — they're the rules the entire messaging flow has to be built around:

- **24-hour session window**: You can only send free-form (non-template) messages within 24 hours of the customer's last message. Outside that window, only pre-approved templates work. Your send logic needs to check this and route accordingly, or auto-fallback to a template.
- **Template categories**: Meta classifies templates as Marketing, Utility, or Authentication, each with different approval scrutiny and pricing. Design your template builder around these three types, not a free-for-all.
- **Opt-in is mandatory** for marketing messages. Track `opted_in` and its source (where/when the customer agreed) — Meta can request evidence, and non-compliant senders get numbers disabled.
- **Quality rating & rate limits**: Each phone number has a Meta-assigned quality rating (High/Medium/Low) that gates how many conversations you can start per day. A broadcast feature without rate-limit-aware batching will get numbers throttled or banned.
- **Webhook idempotency**: Meta retries webhook delivery on timeout. Your webhook handler must dedupe on `wa_message_id`, or you'll double-process messages.

---

## Team & Cost Reality Check

For the MVP scope above (not the full original vision):
- **Team**: 2 backend-leaning full-stack engineers + 1 who can also do frontend polish. A solo founder-engineer can do it but expect 4–5 months, not 10–12 weeks.
- **Meta costs**: Cloud API conversation-based pricing (varies by country and category) — budget for it in your own plan pricing from day one, don't treat it as free infrastructure.
- **Infra for MVP**: a single Postgres instance, Redis, and one small Kubernetes cluster (or even just two Docker containers behind a load balancer) is enough for the first dozens of customers. Kubernetes multi-region belongs in Phase 4, not Phase 1.

---

## What to Keep As-Is From the Original

The original doc's instincts on these were sound and don't need changing:
- Queue-based sending (never send directly from the UI request)
- Organization-scoped multi-tenancy at the data layer
- The overall channel roadmap (WhatsApp → Instagram → Messenger → others), since Meta's Graph API unifies these later
- The AI flow's "suggest → approval → send" staging, rather than jumping to full autonomy
