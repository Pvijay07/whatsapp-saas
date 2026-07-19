'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-[#18181b] text-white overflow-hidden text-sm z-50">
      {/* Dynamic gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#a1a1aa] to-transparent animate-pulse opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-3 relative">
        <Sparkles className="w-3.5 h-3.5 text-[#a1a1aa]" />
        
        <p className="font-light tracking-wide text-[#d4d4d8]">
          <span className="font-semibold text-white">Aura Premium Beta</span> is now live. 
        </p>
        
        <Link href="/pricing" className="font-medium text-white hover:text-[#a1a1aa] transition-colors underline underline-offset-4 decoration-[#3f3f46]">
          Join the waitlist
        </Link>
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 rounded-md text-[#71717a] hover:text-white hover:bg-[#27272a] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
