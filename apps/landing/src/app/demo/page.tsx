'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Check, Sparkles, CheckCircle2 } from 'lucide-react';

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    companySize: '11-50',
    source: 'Google',
    interests: [] as string[],
    message: '',
    agree: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (interest: string) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree) return;
    setLoading(true);

    // Mock API call to store lead
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-88px)] grid grid-cols-1 lg:grid-cols-12 bg-background">
      {/* Left panel - dark */}
      <div className="lg:col-span-5 bg-inverse-surface text-inverse-on-surface px-8 py-16 md:px-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="relative z-10 space-y-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
              <MessageSquare className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-headline font-bold text-lg text-white">Aura</span>
              <span className="block text-[8px] font-mono tracking-widest text-outline-variant -mt-1 uppercase">Messaging</span>
            </div>
          </Link>

          <div className="space-y-6">
            <h1 className="font-headline font-bold text-3xl sm:text-4xl text-white leading-tight">
              See Aura in action
            </h1>
            <p className="text-outline-variant text-sm sm:text-base leading-relaxed">
              Get a personalized walkthrough of how Aura can transform your WhatsApp communication. Our team will show you exactly how to set up your inbox, launch your first broadcast, and automate your workflows.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Personalized demo tailored to your industry',
              'Live Q&A with a product specialist',
              'Custom onboarding plan for your team',
            ].map((prop, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary-container mt-0.5 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium text-outline-variant">{prop}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-outline-variant/10">
            <p className="text-outline-variant text-xs mb-3 font-semibold uppercase tracking-wider font-mono">
              2,500+ businesses already use Aura
            </p>
            <div className="flex -space-x-2 overflow-hidden mb-4">
              <div className="inline-block h-8 w-8 rounded-full bg-surface-dim ring-2 ring-inverse-surface"></div>
              <div className="inline-block h-8 w-8 rounded-full bg-outline ring-2 ring-inverse-surface"></div>
              <div className="inline-block h-8 w-8 rounded-full bg-primary-container ring-2 ring-inverse-surface"></div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm">
          <p className="text-sm italic mb-4">
            "Aura cut our response time by 60% in the first month. Our support agents are happier and customers get help instantly."
          </p>
          <div>
            <p className="font-bold text-xs">Sarah Chen</p>
            <p className="text-[9px] font-mono text-outline-variant uppercase tracking-wider">Head of CX, RetailMax</p>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="lg:col-span-7 bg-surface-container-lowest px-8 py-16 md:px-16 flex items-center justify-center">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6">
            <div className="space-y-2">
              <h2 className="font-headline font-bold text-2xl text-on-surface">Book Your Demo</h2>
              <p className="text-on-surface-variant text-sm">Tell us about your team to get started.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-background border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-lg p-3 text-sm text-on-surface"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-background border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-lg p-3 text-sm text-on-surface"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-background border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-lg p-3 text-sm text-on-surface"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-background border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-lg p-3 text-sm text-on-surface"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-background border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-lg p-3 text-sm text-on-surface"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                  Company Size
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                  className="w-full bg-background border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-lg p-3 text-sm text-on-surface"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono block">
                What are you most interested in?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Team Inbox', 'Broadcasts', 'Automation', 'AI Assistant', 'CRM Pipeline', 'REST API'].map((interest) => (
                  <label
                    key={interest}
                    className="flex items-center gap-3 p-3 bg-background border border-outline-variant/40 rounded-lg cursor-pointer hover:border-primary/40 transition-colors text-xs text-on-surface font-medium"
                  >
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleCheckboxChange(interest)}
                      className="rounded text-primary focus:ring-primary border-outline-variant/60 w-4 h-4"
                    />
                    {interest}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                Message / Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-background border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-lg p-3 text-sm text-on-surface"
              ></textarea>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.agree}
                onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                className="rounded text-primary focus:ring-primary border-outline-variant/60 w-4.5 h-4.5 mt-0.5"
              />
              <span className="text-xs text-on-surface-variant leading-relaxed">
                I agree to the Terms of Service and consent to receiving marketing communications.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !formData.agree}
              className="w-full bg-primary hover:bg-primary-container disabled:opacity-50 text-white py-4 rounded-lg font-bold text-sm transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              {loading ? 'Submitting...' : 'Book My Demo'}
            </button>
          </form>
        ) : (
          <div className="w-full max-w-md text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-headline font-bold text-2xl text-on-surface">Demo Booked!</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Thank you for contacting us, {formData.firstName}. We have stored your request and emailed a confirmation ticket. An Aura representative will contact you within 24 hours to schedule the demo.
              </p>
            </div>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-container font-bold text-sm"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
