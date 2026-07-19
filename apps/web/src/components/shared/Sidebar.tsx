'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Inbox,
  Users,
  FileText,
  Megaphone,
  Network,
  Cpu,
  BarChart3,
  Settings,
  LogOut,
  Triangle,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const navItems = [
    { label: 'Inbox', href: '/inbox', icon: Inbox },
    { label: 'Contacts', href: '/contacts', icon: Users },
    { label: 'Templates', href: '/templates', icon: FileText },
    { label: 'Broadcasts', href: '/broadcasts', icon: Megaphone },
    { label: 'CRM', href: '/crm', icon: Network },
    { label: 'Automation', href: '/automation', icon: Cpu },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  return (
    <nav className="w-[72px] h-screen bg-[#181a1f] border-r border-[#2d2f36] flex flex-col shrink-0 justify-between select-none relative z-50">
      <div className="flex flex-col items-center pt-6 space-y-8">
        {/* Logo / Home */}
        <Link href="/analytics" className="w-10 h-10 flex items-center justify-center text-blue-500 mb-2 hover:scale-110 transition-transform">
          <Triangle className="w-6 h-6 fill-blue-500" />
        </Link>

        {/* Links */}
        <div className="flex flex-col items-center space-y-4 w-full">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`group relative flex items-center justify-center w-full py-3 transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                )}
                <div className={`p-2.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/10' : 'group-hover:bg-[#2d2f36]/50'}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center pb-6 space-y-4 w-full">
        <Link
          href="/settings"
          title="Settings"
          className={`group relative flex items-center justify-center w-full py-3 transition-colors ${
            pathname.startsWith('/settings') ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {pathname.startsWith('/settings') && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
          )}
          <div className={`p-2.5 rounded-xl transition-all duration-200 ${pathname.startsWith('/settings') ? 'bg-primary/10' : 'group-hover:bg-[#2d2f36]/50'}`}>
            <Settings className="w-5 h-5" />
          </div>
        </Link>
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="group relative flex items-center justify-center w-full py-3 text-slate-500 hover:text-red-400 transition-colors"
        >
          <div className="p-2.5 rounded-xl transition-all duration-200 group-hover:bg-red-500/10">
            <LogOut className="w-5 h-5" />
          </div>
        </button>
      </div>
    </nav>
  );
}
