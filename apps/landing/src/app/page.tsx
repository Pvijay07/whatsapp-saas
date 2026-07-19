import React from 'react';
import Link from 'next/link';
import { Shield, Smartphone, Zap } from 'lucide-react';

export default function Homepage() {
  return (
    <div className="relative min-h-screen bg-[#111111] text-[#f8fafc] flex flex-col selection:bg-white/20">
      
      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center px-4 animate-fade-in-up">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="font-headline font-normal text-4xl sm:text-5xl md:text-6xl tracking-normal leading-tight text-white">
            The Epitome of Professional Messaging.
          </h1>
          <p className="text-[#a1a1aa] text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Elevate your WhatsApp Business experience with unparalleled refinement, security, and seamless integration for the modern enterprise.
          </p>
        </div>
      </section>

      {/* 2. Visual Graphic (iPhone Mockup) */}
      <section className="relative w-full max-w-4xl mx-auto px-4 pb-20 flex justify-center perspective-[1000px] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {/* CSS Device Mockup */}
        <div className="relative w-full max-w-[700px] aspect-[2/1] sm:aspect-[2.5/1] bg-gradient-to-br from-[#e2e8f0] to-[#f8fafc] rounded-[2.5rem] border-[4px] border-[#27272a] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden transform rotate-x-[15deg] hover:scale-105 transition-transform duration-700">
          {/* Top Notch/Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[25%] h-5 bg-[#18181b] rounded-full z-20"></div>
          
          {/* Screen Content - Horizontal layout like a landscape phone */}
          <div className="absolute inset-0 bg-[#f8fafc] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
              <h3 className="font-bold text-gray-800 text-lg">Aura</h3>
              <div className="flex gap-4 text-xs text-gray-500 font-medium">
                <span className="hover:text-blue-600 transition-colors cursor-pointer">Chat</span>
                <span className="text-blue-600">Active</span>
              </div>
            </div>
            
            {/* Mock Chat List */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">MG</div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-800 text-sm">Client: Meridian Group</p>
                    <span className="text-xs text-gray-400">9:20 AM</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">How are the new message templates performing?</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">CA</div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-800 text-sm">Partner: The Croft Agency</p>
                    <span className="text-xs text-gray-400">1:00 PM</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">We'll partner across the Amazon campaign.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">SF</div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-800 text-sm">Lead: Sterling Finance</p>
                    <span className="text-xs text-gray-400">Mon</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">Hi, I'd like to get more information on the...</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Glare effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 -rotate-45 translate-x-[-20%] scale-150 pointer-events-none opacity-50"></div>
        </div>
      </section>

      {/* 3. Action Button */}
      <section className="pb-24 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-white text-sm hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Explore Aura Premium <span className="text-xs opacity-70 ml-1">❯</span>
        </Link>
      </section>

      {/* 4. Features Section */}
      <section className="max-w-5xl mx-auto px-4 pb-32 w-full animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="border-t border-[#27272a] pt-12">
          <h2 className="font-headline font-normal text-2xl text-white mb-12">Distinguished Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#27272a]">
            {/* Feature 1 */}
            <div className="md:pr-8 space-y-4 pt-8 md:pt-0">
              <SparkleIcon className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="font-medium text-white text-base">Exquisite Design</h3>
                <p className="text-[#a1a1aa] text-sm mt-2 font-light leading-relaxed">
                  An interface crafted with precision, emphasizing clarity and aesthetic purity.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="md:px-8 space-y-4 pt-8 md:pt-0">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="font-medium text-white text-base">Uncompromised Security</h3>
                <p className="text-[#a1a1aa] text-sm mt-2 font-light leading-relaxed">
                  End-to-end encryption and enterprise-grade data protection.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="md:pl-8 space-y-4 pt-8 md:pt-0">
              <NodesIcon className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="font-medium text-white text-base">Seamless Integration</h3>
                <p className="text-[#a1a1aa] text-sm mt-2 font-light leading-relaxed">
                  Effortlessly connects with your existing CRM and workflow tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// Custom minimal SVG icons to match the design
function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v18M3 12h18M6.3 6.3l11.4 11.4M6.3 17.7l11.4-11.4" opacity="0.3" />
      <path d="M12 2l1.5 7.5L21 11l-7.5 1.5L12 20l-1.5-7.5L3 11l7.5-1.5z" />
    </svg>
  );
}

function NodesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
