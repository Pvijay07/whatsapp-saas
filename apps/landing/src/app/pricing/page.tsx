'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import CtaBanner from '../../components/CtaBanner';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="py-20 text-center max-w-3xl mx-auto px-4">
        <h1 className="font-headline font-bold text-4xl sm:text-5xl mb-6">
          Simple, transparent pricing
        </h1>
        <p className="text-on-surface-variant text-lg sm:text-xl mb-10">
          Start free, upgrade when you grow. No setup fees, no contracts, cancel anytime.
        </p>

        {/* Toggle billing */}
        <div className="inline-flex items-center gap-4 bg-surface-container-high p-1.5 rounded-full border border-outline-variant/30">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              !isAnnual ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${
              isAnnual ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Annually
            <span className="bg-accent-gold text-inverse-surface text-[10px] font-bold px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Starter */}
          <div className="glass-card bg-surface-container-lowest hover:shadow-xl transition-all duration-300 rounded-2xl p-8 flex flex-col justify-between border border-outline-variant/40">
            <div>
              <h3 className="font-headline font-bold text-xl mb-2 text-on-surface">Starter</h3>
              <p className="text-on-surface-variant text-xs mb-8">For small businesses starting on WhatsApp.</p>
              <div className="mb-8">
                <span className="font-headline font-bold text-4xl sm:text-5xl text-on-surface">
                  ${isAnnual ? '39' : '49'}
                </span>
                <span className="text-on-surface-variant text-sm"> / month</span>
                {isAnnual && <p className="text-primary text-[10px] font-semibold mt-1">Billed annually</p>}
              </div>

              <hr className="border-outline-variant/30 mb-8" />

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>2 team members</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>1 WhatsApp number</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>1,000 conversations / month</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>Shared Team Inbox</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>Pre-approved Message Templates</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>Basic Analytics overview</span>
                </li>
              </ul>
            </div>
            <a
              href="http://localhost:3000/register?plan=starter"
              className="w-full text-center border border-primary hover:bg-primary/5 text-primary py-3 rounded-lg font-bold text-sm transition-all duration-200 active:scale-95"
            >
              Start Free Trial
            </a>
          </div>

          {/* Card 2: Growth (Highlighted) */}
          <div className="glass-card bg-surface-container-lowest ring-2 ring-primary relative hover:shadow-2xl transition-all duration-300 rounded-2xl p-8 flex flex-col justify-between border border-primary/20">
            <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white font-headline text-[10px] font-bold tracking-widest px-4 py-1 rounded-full uppercase">
              Most Popular
            </span>
            <div>
              <h3 className="font-headline font-bold text-xl mb-2 text-on-surface">Growth</h3>
              <p className="text-on-surface-variant text-xs mb-8">For scaling teams with automation needs.</p>
              <div className="mb-8">
                <span className="font-headline font-bold text-4xl sm:text-5xl text-on-surface">
                  ${isAnnual ? '119' : '149'}
                </span>
                <span className="text-on-surface-variant text-sm"> / month</span>
                {isAnnual && <p className="text-primary text-[10px] font-semibold mt-1">Billed annually</p>}
              </div>

              <hr className="border-outline-variant/30 mb-8" />

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-semibold text-on-surface">10 team members</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-semibold text-on-surface">3 WhatsApp numbers</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-semibold text-on-surface">10,000 conversations / month</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>Everything in Starter, plus:</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>Broadcast Campaigns builder</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>Workflows Automation builder</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>Tags & Custom Fields database</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>Canned Responses & Notes</span>
                </li>
              </ul>
            </div>
            <a
              href="http://localhost:3000/register?plan=growth"
              className="w-full text-center bg-primary hover:bg-primary-container text-white py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:shadow-md active:scale-95"
            >
              Start Free Trial
            </a>
          </div>

          {/* Card 3: Enterprise */}
          <div className="glass-card bg-surface-container-lowest hover:shadow-xl transition-all duration-300 rounded-2xl p-8 flex flex-col justify-between border border-outline-variant/40">
            <div>
              <h3 className="font-headline font-bold text-xl mb-2 text-on-surface">Enterprise</h3>
              <p className="text-on-surface-variant text-xs mb-8">For large operations requiring custom integration.</p>
              <div className="mb-8">
                <span className="font-headline font-bold text-4xl sm:text-5xl text-on-surface">Custom</span>
                <span className="text-on-surface-variant text-sm"> pricing</span>
                <p className="text-outline text-[10px] font-semibold mt-1">Dedicated terms</p>
              </div>

              <hr className="border-outline-variant/30 mb-8" />

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-semibold text-on-surface">Unlimited team members</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-semibold text-on-surface">Unlimited WhatsApp numbers</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-semibold text-on-surface">Custom conversation volume</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>Everything in Growth, plus:</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>AI reply suggestions & Knowledge base</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>CRM Kanban pipelines</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>Developer APIs & Outbound webhooks</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>SSO / SAML, Audit logs, White-labeling</span>
                </li>
              </ul>
            </div>
            <Link
              href="/demo"
              className="w-full text-center border border-outline hover:bg-surface-container-low text-on-surface py-3 rounded-lg font-bold text-sm transition-all duration-200 active:scale-95"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table Expand */}
      <section className="max-w-4xl mx-auto px-4 pb-24 text-center">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="inline-flex items-center gap-2 border border-outline hover:bg-surface-container-low text-on-surface px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200"
        >
          {showComparison ? 'Hide Feature Comparison' : 'Compare All Features'}
          {showComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showComparison && (
          <div className="mt-8 text-left glass-card p-6 md:p-8 rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/30 text-outline text-xs uppercase tracking-wider font-mono">
                  <th className="pb-4 text-left font-medium">Features</th>
                  <th className="pb-4 text-center font-medium">Starter</th>
                  <th className="pb-4 text-center font-medium">Growth</th>
                  <th className="pb-4 text-center font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr>
                  <td className="py-4 font-semibold text-on-surface">Conversations / mo</td>
                  <td className="py-4 text-center text-on-surface-variant">1,000</td>
                  <td className="py-4 text-center text-on-surface-variant">10,000</td>
                  <td className="py-4 text-center text-on-surface-variant">Custom</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-on-surface">Team Inbox</td>
                  <td className="py-4 text-center text-primary font-bold">✓</td>
                  <td className="py-4 text-center text-primary font-bold">✓</td>
                  <td className="py-4 text-center text-primary font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-on-surface">Campaigns & Broadcasts</td>
                  <td className="py-4 text-center text-outline-variant">—</td>
                  <td className="py-4 text-center text-primary font-bold">✓</td>
                  <td className="py-4 text-center text-primary font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-on-surface">Automation builder</td>
                  <td className="py-4 text-center text-outline-variant">—</td>
                  <td className="py-4 text-center text-primary font-bold">✓</td>
                  <td className="py-4 text-center text-primary font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-on-surface">AI reply suggestions</td>
                  <td className="py-4 text-center text-outline-variant">—</td>
                  <td className="py-4 text-center text-outline-variant">—</td>
                  <td className="py-4 text-center text-primary font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-on-surface">CRM Pipeline</td>
                  <td className="py-4 text-center text-outline-variant">—</td>
                  <td className="py-4 text-center text-outline-variant">—</td>
                  <td className="py-4 text-center text-primary font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-on-surface">Developer APIs & webhooks</td>
                  <td className="py-4 text-center text-outline-variant">—</td>
                  <td className="py-4 text-center text-outline-variant">—</td>
                  <td className="py-4 text-center text-primary font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-on-surface">SSO / SAML login</td>
                  <td className="py-4 text-center text-outline-variant">—</td>
                  <td className="py-4 text-center text-outline-variant">—</td>
                  <td className="py-4 text-center text-primary font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-on-surface">White-label UI config</td>
                  <td className="py-4 text-center text-outline-variant">—</td>
                  <td className="py-4 text-center text-outline-variant">—</td>
                  <td className="py-4 text-center text-primary font-bold">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 pb-28">
        <h2 className="font-headline font-bold text-2xl sm:text-3xl text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'What counts as a conversation?',
              a: 'WhatsApp charges on a conversation basis. A conversation is a 24-hour window that starts when your team sends the first template message or responds to an incoming customer query. All messages within this 24-hour window are free.',
            },
            {
              q: 'Can I change plans anytime?',
              a: 'Yes, you can upgrade, downgrade, or cancel your subscription at any point. Upgrades apply immediately, while downgrades or cancellations take effect at the end of the current billing cycle.',
            },
            {
              q: 'Do you charge per message?',
              a: 'No. Aura charges a flat monthly fee based on the features and conversation limits of your plan. However, Meta imposes conversation-based costs depending on the category (Utility, Marketing, Authentication). We pass these direct Meta charges straight through to you with no markup.',
            },
            {
              q: 'What happens if I exceed my conversation limits?',
              a: 'If you approach your conversation volume limit, we will notify you immediately. We will never drop your messages silently. Extra conversations are billed at a flat rate of $0.03 per conversation, or you can choose to auto-upgrade to the next tier.',
            },
            {
              q: 'Is there a free trial?',
              a: 'Yes! We offer a 14-day fully-featured trial of the Starter and Growth plans. No credit card is required to sign up.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards, Apple Pay, Google Pay, and bank wire transfers (available on Enterprise plans).',
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container-low transition-colors"
              >
                <span className="font-bold text-sm sm:text-base text-on-surface">{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-outline" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-outline" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <CtaBanner />
    </div>
  );
}
