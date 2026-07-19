'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Shield, HelpCircle, Check } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    // Simulate Meta Embedded Signup popup
    setTimeout(() => {
      // Create mock phone connection
      const token = localStorage.getItem('token');
      fetch('http://localhost:3001/api/whatsapp/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: 'mock_code_from_facebook' }),
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          router.push('/onboarding/success');
        })
        .catch(() => {
          // Mock success fallback for offline testing
          router.push('/onboarding/success');
        });
    }, 1500);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background p-6">
      <div className="glass-card bg-surface-container-lowest max-w-xl w-full p-8 md:p-10 rounded-2xl border border-outline-variant/30 text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8 fill-primary" />
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface">
            Connect your WhatsApp Business Account
          </h1>
          <p className="text-on-surface-variant text-sm max-w-md mx-auto leading-relaxed">
            Link your phone number and Meta Business profile using the secure Facebook Embedded Signup flow.
          </p>
        </div>

        {/* Benefits list */}
        <div className="bg-surface-container-low p-5 rounded-xl text-left space-y-4 max-w-md mx-auto">
          <h3 className="font-headline font-bold text-sm text-on-surface uppercase tracking-wider font-mono">
            You will authorize Aura to:
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-on-surface-variant">
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>Read and manage your WhatsApp Business Account configuration</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>Send and receive messages on behalf of your phone numbers</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>Sync templates and status approvals from Meta’s servers</span>
            </li>
          </ul>
        </div>

        {/* Action */}
        <div className="space-y-4 max-w-md mx-auto">
          <Button
            onClick={handleConnect}
            fullWidth
            disabled={loading}
            className="py-4 gap-2"
          >
            {loading ? 'Opening Meta Login...' : 'Connect WhatsApp Account'}
          </Button>
          <p className="text-[10px] text-outline leading-normal max-w-xs mx-auto">
            Requires a verified Meta Business Manager and an active phone number that is not linked to personal WhatsApp apps.
          </p>
        </div>
      </div>
    </div>
  );
}
