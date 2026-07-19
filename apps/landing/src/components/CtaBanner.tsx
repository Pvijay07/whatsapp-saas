import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-tr from-primary via-secondary to-[#581c87] border-t border-white/5">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-white/20 blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="font-headline font-bold text-3xl sm:text-4xl text-white leading-tight">
          Ready to transform your WhatsApp communication?
        </h2>
        <p className="text-slate-200 text-lg max-w-2xl mx-auto leading-relaxed font-light">
          Join thousands of scaling businesses managing sales, support, and broadcasts on the world's most popular messaging app.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <a
            href="http://localhost:3000/register"
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0f172a] px-8 py-4 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-xl active:scale-95"
          >
            Start Your Free Trial <ArrowRight className="w-5 h-5" />
          </a>
          <Link
            href="/demo"
            className="w-full sm:w-auto border border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-lg font-bold text-base flex items-center justify-center transition-all duration-200 active:scale-95"
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
