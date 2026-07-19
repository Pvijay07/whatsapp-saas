import React from 'react';
import Link from 'next/link';
import { MessageSquare, Twitter, Github, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface border-t border-outline-variant/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow shadow-primary/30">
                <MessageSquare className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="font-headline font-bold text-xl text-white">Aura</span>
                <span className="block text-[10px] font-mono tracking-widest text-outline-variant -mt-1 uppercase">Messaging</span>
              </div>
            </Link>
            <p className="text-outline-variant text-sm max-w-sm mb-6 leading-relaxed">
              Aura is a premium, secure customer engagement platform built for WhatsApp Business APIs. Connect, automate, and route your team workspace channels.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors text-outline-variant">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors text-outline-variant">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors text-outline-variant">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors text-outline-variant">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-headline text-white font-bold text-sm mb-6 uppercase tracking-wider">Product</h3>
            <ul className="space-y-4 text-sm text-outline-variant">
              <li><Link href="/features" className="hover:text-white transition-colors">Shared Team Inbox</Link></li>
              <li><Link href="/features" className="hover:text-white transition-colors">Broadcasts & Campaigns</Link></li>
              <li><Link href="/features" className="hover:text-white transition-colors">Workflows Automation</Link></li>
              <li><Link href="/features" className="hover:text-white transition-colors">AI Reply Copilot</Link></li>
              <li><Link href="/features" className="hover:text-white transition-colors">CRM Kanban Pipeline</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline text-white font-bold text-sm mb-6 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-4 text-sm text-outline-variant">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog & Guides</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Meta WABA Setup</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing Details</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline text-white font-bold text-sm mb-6 uppercase tracking-wider">Company</h3>
            <ul className="space-y-4 text-sm text-outline-variant">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Details</a></li>
            </ul>
          </div>
        </div>

        <hr className="border-outline-variant/10 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-outline-variant">
          <p>© {new Date().getFullYear()} Aura. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
