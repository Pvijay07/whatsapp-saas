import React from 'react';
import {
  MessageSquare,
  Zap,
  TrendingUp,
  Brain,
  Layers,
  Shield,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';
import CtaBanner from '../../components/CtaBanner';

export default function FeaturesPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4">
        <h1 className="font-headline font-bold text-4xl sm:text-5xl mb-6">
          Everything you need to master WhatsApp Business
        </h1>
        <p className="text-on-surface-variant text-lg sm:text-xl leading-relaxed">
          Deep-dive into our purpose-built messaging platform. Scalable architecture, enterprise security, and intuitive tools that require no engineering support.
        </p>
      </section>

      {/* alternating deep dives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 pb-24">
        {/* Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
              <MessageSquare className="w-4 h-4" />
              Shared Team Workspace
            </div>
            <h2 className="font-headline font-bold text-3xl mb-6">One inbox for your entire team</h2>
            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
              Ditch multiple devices and browser tabs. Connect multiple support agents to a single verified WhatsApp number. Assign, tag, and reply in real-time.
            </p>
            <ul className="space-y-4">
              {['Real-time message sync across agents', 'Auto-assignment & manual triage queues', '24-hour compliance session tracking', 'Internal notes & canned replies'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 shadow-lg h-[340px] flex items-center justify-center font-mono text-outline text-xs">
              [ Shared Inbox Interface UI Screenshot ]
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 shadow-lg h-[340px] flex items-center justify-center font-mono text-outline text-xs">
              [ Broadcast Builder & Schedule Campaign Mockup ]
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
              <Zap className="w-4 h-4" />
              Broadcast Campaigns
            </div>
            <h2 className="font-headline font-bold text-3xl mb-6">Reach thousands, personally</h2>
            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
              Launch bulk marketing campaigns using approved templates. Target specific lists via tags, inject dynamic variables, and avoid spam rates with built-in throttle gates.
            </p>
            <ul className="space-y-4">
              {['CSV recipient database upload', 'Live audience count filters', 'Scheduled timezone-aware dispatch', 'Delivery & read funnel metrics reporting'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
              <Layers className="w-4 h-4" />
              Workflow Automation
            </div>
            <h2 className="font-headline font-bold text-3xl mb-6">Automate without code</h2>
            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
              Create instant pathways for common customer requests. Match key phrases, trigger template replies, auto-tag leads, or transfer chats to a human agent.
            </p>
            <ul className="space-y-4">
              {['Keyword match auto-responders', 'Linear delay wait times', 'Auto-assignment & tagging triggers', 'Outbound webhook trigger integrations'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 shadow-lg h-[340px] flex items-center justify-center font-mono text-outline text-xs">
              [ Linear Workflow Builder Builder Mockup ]
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 shadow-lg h-[340px] flex items-center justify-center font-mono text-outline text-xs">
              [ AI reply Suggestions compose area Mockup ]
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
              <Brain className="w-4 h-4" />
              AI Copilot
            </div>
            <h2 className="font-headline font-bold text-3xl mb-6">AI that knows your business</h2>
            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
              Feed your FAQs, policy terms, and manuals directly to the local knowledge base. The AI analyzes incoming customer tickets and suggests accurate responses for your agents to review.
            </p>
            <ul className="space-y-4">
              {['Secure local document uploads', 'Async AI drafting queue', 'Real-time source chunk references', 'Agent accept/edit/reject logging'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
              <TrendingUp className="w-4 h-4" />
              CRM Pipeline
            </div>
            <h2 className="font-headline font-bold text-3xl mb-6">From conversation to conversion</h2>
            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
              Never lose track of sales inquiries. Create deals, assign deal values, and move prospects through customizable pipeline columns directly from the inbox interface.
            </p>
            <ul className="space-y-4">
              {['Drag-and-drop Kanban card board', 'Deal value & currency indicators', 'Conversation link attachments', 'Activity event logging'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 shadow-lg h-[340px] flex items-center justify-center font-mono text-outline text-xs">
              [ CRM Kanban Deal pipeline Board Screenshot ]
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 bg-surface-container-low border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-headline font-bold text-3xl mb-6">Built to connect</h2>
          <p className="text-on-surface-variant text-base max-w-2xl mx-auto mb-16">
            Easily connect Aura with your existing ecommerce platform, CRM database, or automation suite. Integrate with our REST API.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {['Shopify', 'WooCommerce', 'Zapier', 'Hubspot', 'Salesforce', 'Developer API'].map((integr, idx) => (
              <div key={idx} className="glass-card py-8 rounded-xl font-headline font-bold text-base hover:shadow-md transition-shadow">
                {integr}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaBanner />
    </div>
  );
}
