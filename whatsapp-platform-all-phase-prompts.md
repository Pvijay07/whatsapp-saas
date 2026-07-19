# WhatsApp Platform — Full Build Prompts, All Phases

Use these in order. Each phase assumes the previous one is live with real 
users — don't jump ahead. Feed the "Development Prompt" to an AI coding 
tool (Claude Code, Cursor, etc.) and the "Design Prompt" to a design tool, 
one phase at a time.

---

# PHASE 1 — MVP (10–12 weeks)

## Development Prompt

```
Build a multi-tenant WhatsApp Business messaging platform (Team Inbox + 
Broadcasts), architected as a modular monolith that can later be split 
into services — not as microservices from day one.

CONTEXT
This platform lets customer businesses connect their own WhatsApp Business 
Account (WABA) via Meta's Embedded Signup flow. We do not provision or 
verify numbers on behalf of customers — they bring their own already-
verified Meta Business and number. Our app itself must be built as a 
Meta Tech Provider integration (whatsapp_business_management and 
whatsapp_business_messaging permissions), so structure the WhatsApp 
module around OAuth-style account connection, not direct number 
registration.

ARCHITECTURE
- Two deployable units, one codebase, one database:
  - apps/api — NestJS, organized by domain module (not by technical layer)
  - apps/worker — same codebase, separate process, consumes BullMQ queues
  - apps/web — Next.js dashboard (App Router, TypeScript, Tailwind)
- Domain modules: auth, organizations, contacts, conversations, whatsapp, 
  billing, analytics — each with its own controllers/services/repositories, 
  minimal cross-module imports, so any module can be extracted into its 
  own service later without a rewrite.
- Postgres (Prisma or Drizzle — pick one and be consistent), Redis for 
  cache + BullMQ, S3-compatible storage for media attachments.
- Never send WhatsApp messages synchronously from an API request. Every 
  outbound send goes: API validates -> enqueue job -> worker sends via 
  Meta Cloud API -> webhook confirms status -> update message row.

WHATSAPP INTEGRATION REQUIREMENTS
- Build the "Connect WhatsApp" flow using Meta's Embedded Signup (OAuth 
  popup), storing the resulting waba_id and phone_number_id per organization.
- Webhook handler must be idempotent: dedupe incoming events on 
  wa_message_id, since Meta retries on timeout.
- Track conversations.last_customer_message_at and enforce the 24-hour 
  session window: outside that window, only pre-approved templates can 
  be sent; inside it, free-form messages are allowed. Build this check 
  into the send-message service, not just the UI.
- Template model must support Meta's three categories (marketing, utility, 
  authentication) with a status field (pending/approved/rejected) synced 
  via webhook.
- Track contact opt-in status and the source/timestamp of consent — 
  required for sending marketing messages and for compliance audits.
- Respect Meta's per-number rate limits/quality rating when batching 
  broadcasts — implement backoff, not just a flat send rate.

CORE SCHEMA (implement these tables with these fields, extend as needed)
- organizations: id, name, slug, plan_id, timezone, created_at
- phone_numbers: id, organization_id, waba_id, phone_number_id, 
  display_number, status, quality_rating
- contacts: id, organization_id, wa_id, name, opted_in, opted_in_at, 
  last_message_at, created_at
- conversations: id, organization_id, contact_id, phone_number_id, 
  assigned_agent_id, status, last_customer_message_at, unread_count
- messages: id, conversation_id, direction, wa_message_id, type, 
  content (jsonb), status, template_id, created_at
- templates: id, organization_id, name, category, language, status, 
  meta_template_id, components (jsonb), rejection_reason
- broadcasts: id, organization_id, template_id, audience_filter (jsonb), 
  status, total_recipients, sent_count, failed_count, scheduled_at

SCOPE (build only this — do not add automation builder, AI, or CRM 
pipeline yet)
1. Auth: email/password + session, single organization per user to start, 
   organization-scoped data model throughout (every query filtered by 
   organization_id)
2. Roles: Owner and Agent only (skip the 6-tier hierarchy)
3. WhatsApp connection via Embedded Signup, webhook ingestion, send queue
4. Contacts: auto-created from inbound messages, manual creation, opt-in 
   tracking
5. Team Inbox: conversation list, manual assignment, reply, mark resolved
6. Templates: create, submit to Meta, display approval status
7. Minimal analytics: counts of sent/delivered/read/failed per day

EXPLICITLY OUT OF SCOPE (note as TODOs, don't implement)
- Automation/workflow builder
- AI reply suggestions
- CRM pipeline/deals
- Multi-channel (Instagram, Messenger, etc.)
- White-label, SSO/SCIM
- Round-robin/least-busy routing (manual assignment only for now)

QUALITY BAR
- TypeScript strict mode throughout
- Every module has unit tests for its service layer and at least one 
  integration test for its main API route
- OpenAPI docs generated from NestJS decorators
- Structured logging (not console.log) with organization_id and 
  conversation_id in log context for traceability
- Docker Compose setup that runs api + worker + web + postgres + redis 
  locally with one command
```

## Design Prompt

```
Design a modern SaaS dashboard for a WhatsApp-first customer messaging 
platform, scoped to the MVP feature set below — not the full long-term 
product vision.

STYLE
- Clean, professional, enterprise-grade — reference points: Linear, 
  Slack, Stripe Dashboard, Vercel
- Light and dark themes
- Desktop-first, responsive down to tablet (mobile is a separate native 
  app later, not a responsive requirement for this pass)
- Consistent design system: typography scale, spacing scale, a small 
  set of accent colors, consistent button/input/modal/table components

SCREENS TO DESIGN (MVP only)

1. Onboarding / Connect WhatsApp
   - A single clear "Connect your WhatsApp Business Account" screen 
     that launches Meta's Embedded Signup popup — explain in plain 
     language what the business is authorizing, not technical jargon 
     about permissions or APIs
   - Post-connection: confirmation showing the connected number, 
     its status (pending/active), and next step (create your first template)

2. Team Inbox (the core screen — spend the most design effort here)
   - Left column: conversation list, unread indicators, filter by 
     status (open/pending/resolved) and assigned agent
   - Center: chat thread with message bubbles distinguishing inbound/
     outbound, delivery/read ticks, timestamps, and a clear visual 
     marker for "outside the 24-hour window — template required" so 
     agents understand why free-text is disabled
   - Right sidebar: contact profile (name, phone, opt-in status, tags, 
     notes), assignment control
   - Compose box: text input, template picker (required when outside 
     the 24h window), attachment button

3. Contacts
   - Table view: name, phone, opt-in status, last message, tags
   - Detail view: conversation history, opt-in source/timestamp, edit fields

4. Templates
   - List view with status badges (pending/approved/rejected), category 
     (marketing/utility/authentication)
   - Create/edit form matching Meta's template structure (header, body, 
     footer, buttons) with a live preview that looks like an actual 
     WhatsApp message bubble

5. Basic Analytics
   - KPI cards: messages sent, delivered, read, failed (last 7/30 days)
   - Simple line/bar chart for daily volume
   - Table: response time per agent

6. Settings
   - Organization profile, connected WhatsApp number(s), team members 
     and roles (Owner/Agent), billing plan summary

DESIGN NOTES
- The WhatsApp template preview (screen 4) must visually resemble an 
  actual WhatsApp message — this is what builds trust that the platform 
  understands the channel.
- The 24-hour window indicator in the inbox (screen 2) is a compliance-
  critical UI element, not decorative — make it unmissable but not alarmist.
- Do not design screens for automation builder, AI assistant, or CRM 
  pipeline yet — those come in a later design pass.

DELIVERABLE
Component-level fidelity (not just static mockups) — real states for 
empty inbox, loading, error, and populated, since this will be handed 
directly to engineers building the Next.js frontend.
```

---

# PHASE 2 — Retention Features (6–8 weeks)

## Development Prompt

```
Extend the existing WhatsApp platform (modular monolith: apps/api, 
apps/worker, apps/web) with retention and revenue features. This phase 
assumes Phase 1's auth, contacts, conversations, whatsapp, and templates 
modules are already live in production with real customers — build 
additively, don't restructure what's working.

NEW MODULES

1. Broadcasts
   - CSV upload of recipient phone numbers, or audience filter built 
     from contact tags/custom fields
   - Validation step: dedupe numbers, check opt_in status, strip 
     invalid/malformed numbers before queueing
   - Batch sending through the existing worker queue, respecting the 
     phone number's Meta-assigned quality rating and rate tier — 
     implement adaptive throttling, not a fixed rate, since a number's 
     allowed rate can change
   - Per-broadcast report: sent, delivered, read, failed, opt-outs 
     triggered

2. Campaign Scheduling
   - Extend broadcasts with a scheduled_at field and a scheduler job 
     (cron-style, checked by the worker) that promotes scheduled 
     broadcasts to "sending" at the right time
   - Timezone-aware scheduling per organization

3. Tags & Custom Fields
   - organization-scoped tag definitions, many-to-many with contacts
   - custom_fields table: organization-scoped field definitions 
     (text/number/date/select type) plus a contact_custom_field_values 
     table — do not use a single jsonb blob on contacts, since fields 
     need to be filterable/indexable for broadcast audience targeting

4. Canned Responses & Internal Notes
   - canned_responses: organization-scoped, shortcut key + body, 
     insertable into the compose box
   - notes: conversation-scoped, agent-authored, visible only to 
     team members not the customer

5. Routing
   - Add round-robin and least-busy assignment as alternatives to 
     manual assignment, configurable per organization or per phone 
     number
   - Keep manual assignment as the default and always-available fallback

6. Billing Enforcement
   - plans table (if not already present) with limits: seats, phone 
     numbers, messages/month, broadcast recipients/month
   - Middleware/guard that checks usage against plan limits before 
     allowing a broadcast to queue or a new seat to be added — fail 
     with a clear upgrade-prompt error, not a silent drop
   - Usage tracking table incrementing on each billable action

DATA MODEL ADDITIONS
- tags: id, organization_id, name, color
- contact_tags: contact_id, tag_id
- custom_fields: id, organization_id, name, type, options (jsonb)
- contact_custom_field_values: contact_id, custom_field_id, value
- canned_responses: id, organization_id, shortcut, body
- notes: id, conversation_id, author_id, body, created_at
- plans: id, name, seat_limit, number_limit, monthly_message_limit
- usage_records: id, organization_id, period, metric, count

QUALITY BAR
- Broadcast sending must be resumable — if the worker restarts mid-batch, 
  it should not re-send to already-sent recipients (track per-recipient 
  status in a campaign_messages join table, not just aggregate counts)
- Rate limit handling must back off on Meta 429/error responses and 
  retry with jitter, not fail the whole batch
- All new list views (broadcasts, tags) must support pagination — 
  organizations will accumulate thousands of contacts
```

## Design Prompt

```
Extend the existing WhatsApp platform design system with retention and 
revenue screens. Match the established design language (reference: 
Linear/Slack/Stripe Dashboard, light+dark themes, existing component 
library) — do not introduce a new visual style.

NEW SCREENS

1. Broadcast Builder (multi-step flow)
   - Step 1: Choose template (reuse the template preview component 
     from Phase 1)
   - Step 2: Define audience — CSV upload OR filter builder (tag/custom 
     field conditions, live recipient count preview)
   - Step 3: Review & schedule — send now or pick date/time, timezone shown
   - Step 4: Confirmation with a link to the live report

2. Broadcast Report
   - Funnel-style visualization: recipients -> sent -> delivered -> read
   - Failure breakdown (invalid number, opted out, rate limited, other)
   - Exportable recipient-level table

3. Contact Detail — extended
   - Tag chips (add/remove inline)
   - Custom fields section, editable inline
   - Notes tab alongside conversation history tab

4. Canned Responses Manager
   - Simple list: shortcut key, preview of body, edit/delete
   - Compose box gets a "/" trigger that surfaces matching canned 
     responses inline (design this interaction, not just the manager screen)

5. Team Settings — extended
   - Routing rule configuration (manual / round-robin / least-busy) 
     per phone number
   - Plan usage dashboard: seats used/limit, numbers used/limit, 
     messages sent this period/limit, with a clear upgrade CTA when 
     approaching limits

DESIGN NOTES
- The audience filter builder (screen 1, step 2) is the highest-risk 
  UI for user error — a wrong filter sends to the wrong people. Show 
  a live, prominent recipient count as filters change, and require 
  explicit confirmation before queueing a broadcast over some 
  threshold (e.g., 500 recipients).
- Plan usage indicators (screen 5) should appear proactively wherever 
  a user might hit a limit (e.g., in the broadcast builder if the 
  audience size would exceed the monthly message limit), not just 
  buried in settings.
```

---

# PHASE 3 — Differentiation (2–3 months)

## Development Prompt

```
Extend the WhatsApp platform with automation, AI, CRM, and public API 
capabilities. This phase assumes Phases 1–2 are live in production. 
Each capability below is substantial enough to be its own workstream — 
sequence them (automation first, then AI, then CRM, then public API) 
rather than building in parallel with a small team.

1. AUTOMATION ENGINE (build linear first, node-graph later)
   - Start with a simple trigger -> conditions -> actions model, NOT a 
     full visual node-graph builder — that's a separate, larger project
   - Triggers: message received, keyword/contains match, tag added, 
     conversation status changed
   - Actions: send template, add tag, assign to agent/team, wait 
     (delay), send to webhook
   - Store workflows as a JSON definition (ordered steps), executed by 
     a dedicated worker processor — reuse the existing BullMQ 
     infrastructure, add a workflow_executions table to track state 
     per contact per workflow (for resumability across delay/wait steps)
   - Only after the linear version is used by real customers, consider 
     a true node-graph builder (workflow_nodes/workflow_edges tables, 
     drag-and-drop UI) — treat this as an optional Phase 3.5

2. AI ASSISTANT (start in "suggest only" mode — never auto-send by default)
   - Modes, in order of increasing autonomy: suggest only -> human 
     approval required -> auto-reply for whitelisted intents -> full autonomy. 
     Ship only "suggest only" and "human approval" first; gate the 
     later modes behind explicit per-organization opt-in
   - Knowledge base: organization-scoped documents/FAQs, chunked and 
     embedded, stored in a vector-capable store (pgvector on the 
     existing Postgres is sufficient at this scale — don't add a 
     separate vector database yet)
   - RAG flow: incoming message -> retrieve relevant chunks -> LLM 
     generates draft reply -> surfaced to agent in the inbox UI as a 
     suggestion, one click to send or edit
   - Make the LLM provider pluggable (interface-based), not hardcoded 
     to one vendor
   - Log every AI suggestion and whether it was used as-is, edited, or 
     rejected — this data is what justifies expanding to auto-reply modes

3. CRM PIPELINE
   - pipelines, pipeline_stages (organization-configurable), deals 
     (linked to a contact and optionally a conversation), activities 
     (timestamped log entries: stage changes, notes, tasks)
   - Every conversation can optionally be linked to a deal — this is 
     additive to the inbox, not a replacement for it
   - Kanban-style board view grouped by stage, with drag-to-change-stage 
     updating the deal record

4. PUBLIC API & WEBHOOKS
   - Versioned REST API (/v1/...) covering: send message, create 
     contact, list conversations, create/list templates, trigger 
     workflow
   - API key management UI (create/revoke, scoped permissions)
   - Outbound webhooks for: message received, message status changed, 
     template status changed, deal stage changed — with retry-with-backoff 
     and a delivery log visible to the customer
   - Rate limit the public API separately from internal dashboard 
     traffic

DATA MODEL ADDITIONS
- workflows: id, organization_id, name, trigger_type, trigger_config 
  (jsonb), steps (jsonb ordered array), status (active/paused)
- workflow_executions: id, workflow_id, contact_id, current_step, 
  status, next_run_at
- ai_conversations: id, conversation_id, mode, suggestion_text, 
  action_taken (used/edited/rejected), created_at
- knowledge_base_documents: id, organization_id, title, content, 
  embedding vector
- pipelines, pipeline_stages, deals, activities
- api_keys: id, organization_id, key_hash, scopes, last_used_at
- webhook_subscriptions: id, organization_id, url, events (array), 
  secret
- webhook_deliveries: id, subscription_id, event, status, attempts, 
  last_attempted_at

QUALITY BAR
- AI suggestion latency should not block the inbox UI — generate 
  asynchronously and stream/update the suggestion into the UI when ready
- Workflow executions must survive a worker restart (persisted state, 
  not in-memory)
- Public API must have OpenAPI docs published to customers, with 
  request/response examples
```

## Design Prompt

```
Design the differentiation-phase screens for the WhatsApp platform, 
matching the existing design system. These are more complex flows — 
prioritize clarity over density.

1. Automation Builder (linear version)
   - Vertical step list: trigger card at top, then condition cards, 
     then action cards, connected by simple vertical lines (not a 
     free-form canvas yet)
   - Each step type has a distinct icon/color for quick scanning
   - Inline editing of each step's config (e.g., clicking "send 
     template" step opens a template picker inline, not a separate modal)
   - A "test this workflow" mode that shows a simulated run against 
     a sample contact

2. AI Suggestion in Inbox
   - Suggested reply appears as a distinct, visually different bubble 
     in the compose area (not mixed in with sent messages) — clearly 
     labeled as AI-generated
   - One-click "Send as-is," inline edit, or dismiss
   - A small indicator showing which knowledge base source the 
     suggestion drew from, for agent trust

3. Knowledge Base Manager
   - Simple document list (upload/paste text), processing status 
     (indexing/ready), and a test query box to preview what the AI 
     retrieves for a sample question

4. CRM Pipeline Board
   - Kanban columns per stage, deal cards showing contact name, deal 
     value, last activity, drag-and-drop between stages
   - Deal detail panel: linked conversation preview, activity timeline, 
     editable fields

5. Developer Settings (API & Webhooks)
   - API key list with scopes, create/revoke actions, one-time key 
     reveal on creation
   - Webhook subscription manager: URL, event checkboxes, recent 
     delivery log with status codes and a "retry" action

DESIGN NOTES
- The AI suggestion UI (screen 2) needs to make it unmistakable that 
  the agent is looking at an AI draft, not an already-sent message — 
  use a distinct color/border treatment, not just a small label.
- The automation builder (screen 1) should feel approachable to a 
  non-technical small-business owner, not like a developer tool — 
  favor plain-language step descriptions over technical jargon.
```

---

# PHASE 4 — Enterprise (ongoing, build as sales requires it)

## Development Prompt

```
Add enterprise capabilities to the WhatsApp platform. Unlike Phases 1–3, 
do not build these speculatively — implement each item only when a 
specific customer or deal requires it, since enterprise features (SSO, 
white-label, multi-region) carry ongoing operational cost.

1. OMNICHANNEL (Instagram, Messenger)
   - Meta's Graph API unifies messaging for Instagram and Messenger 
     similarly to WhatsApp Cloud API — extend the existing webhook and 
     send-queue infrastructure with a channel field on conversations 
     and messages rather than building parallel pipelines
   - Reuse the Team Inbox UI with a channel filter/badge, don't build 
     separate inboxes per channel

2. WHITE-LABEL
   - Per-organization branding: logo, color theme, custom domain 
     (CNAME + SSL provisioning)
   - Strip platform branding from customer-facing surfaces (templates 
     sent to end customers already don't show platform branding via 
     WhatsApp itself — this is primarily about the dashboard UI and 
     any customer-facing status pages)

3. PARTNER/RESELLER PORTAL
   - A partner role that can create and manage multiple organizations 
     under a revenue-share or reseller billing arrangement
   - Partner-level analytics rolling up across their managed organizations

4. AUDIT LOGS & COMPLIANCE
   - audit_logs table: actor, action, target_type, target_id, 
     before/after diff (jsonb), timestamp, ip_address
   - Log at minimum: auth events, role changes, billing changes, 
     data exports, broadcast sends, API key creation/revocation
   - Exportable audit log UI for enterprise customers' compliance needs

5. SSO / SCIM
   - SAML or OIDC SSO per organization (support at least OIDC first — 
     covers most enterprise IdPs including Okta, Azure AD, Google 
     Workspace)
   - SCIM for automated user provisioning/deprovisioning from the 
     customer's IdP

6. HIGH AVAILABILITY / MULTI-REGION
   - Only pursue this once you have specific latency or data-residency 
     requirements from a customer (e.g., EU data residency) — don't 
     build multi-region speculatively
   - If required: read replicas per region, queue partitioning by 
     organization's home region, and clear documentation of what's 
     replicated vs. region-local

QUALITY BAR
- Every enterprise feature must be independently toggleable per 
  organization (feature flags), since these are premium/opt-in, not 
  platform-wide changes
- SSO/SCIM and audit logs should be built against standard libraries/
  protocols (don't hand-roll SAML), and tested against at least one 
  real IdP (Okta or Azure AD sandbox) before shipping
```

## Design Prompt

```
Design enterprise-tier screens for the WhatsApp platform. These are 
lower-traffic, higher-complexity screens used by admins, not day-to-day 
agents — favor clarity and safety (confirmation steps for destructive 
actions) over speed of use.

1. White-Label Settings
   - Logo upload, color theme picker with live preview of the dashboard 
     re-skinned, custom domain setup with clear DNS instructions and 
     verification status

2. Partner Portal
   - Organization list under management, aggregate metrics, 
     create-new-organization flow, billing/revenue-share summary

3. Audit Log Viewer
   - Filterable table: actor, action type, date range, target
   - Detail drawer showing before/after diff for changes
   - Export action (CSV/PDF) for compliance requests

4. SSO Configuration
   - Step-by-step IdP connection wizard (metadata URL or manual entry), 
     test-connection action, clear success/failure states
   - SCIM provisioning status (last sync time, users synced, errors)

DESIGN NOTES
- These screens are used rarely but need to feel trustworthy — an IT 
  admin configuring SSO for their company is evaluating whether this 
  platform is enterprise-grade. Favor precise, unambiguous copy over 
  friendly/casual tone here, a shift from the rest of the product.
- Destructive or high-impact actions (revoking SSO, changing white-label 
  domain, exporting audit logs with PII) should require an explicit 
  confirmation step.
```
