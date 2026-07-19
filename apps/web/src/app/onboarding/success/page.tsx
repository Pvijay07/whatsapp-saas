'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight, AlertCircle, PhoneCall } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function ConnectionSuccessPage() {
  const router = useRouter();

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background p-6">
      <div className="glass-card bg-surface-container-lowest max-w-xl w-full p-8 md:p-10 rounded-2xl border border-outline-variant/30 text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-full bg-status-success/15 text-status-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface">
            WhatsApp Connected Successfully
          </h1>
          <p className="text-on-surface-variant text-sm max-w-md mx-auto leading-relaxed">
            Your WhatsApp Business profile is connected. You can now configure variables and templates.
          </p>
        </div>

        {/* Connected Number details */}
        <div className="border border-outline-variant/40 rounded-xl p-5 max-w-md mx-auto bg-surface-container-low text-left space-y-3">
          <div className="flex items-center gap-3">
            <PhoneCall className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-outline font-mono uppercase tracking-wider">Connected Number</p>
              <p className="font-headline font-bold text-base text-on-surface">+1 (555) 019-2834</p>
            </div>
          </div>
          <div className="flex gap-6 pt-2 border-t border-outline-variant/10 text-xs font-mono">
            <div>
              <span className="text-outline block uppercase tracking-wider">WABA Status</span>
              <span className="text-status-success font-semibold">ACTIVE</span>
            </div>
            <div>
              <span className="text-outline block uppercase tracking-wider">Quality rating</span>
              <span className="text-status-success font-semibold">HIGH</span>
            </div>
          </div>
        </div>

        {/* Next step */}
        <div className="max-w-md mx-auto space-y-4">
          <Button
            onClick={() => router.push('/inbox')}
            fullWidth
            className="py-4 gap-2"
          >
            Go to Team Inbox <ChevronRight className="w-5 h-5" />
          </Button>
          <button
            onClick={() => router.push('/templates')}
            className="w-full text-center text-xs font-semibold text-primary hover:text-primary-container"
          >
            Or, create your first Message Template
          </button>
        </div>
      </div>
    </div>
  );
}
