'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, Shield, Zap, Layers, Sparkles } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    organizationName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('orgId', data.organization.id);
      
      // Redirect to onboarding connection page
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen grid grid-cols-1 lg:grid-cols-12 bg-surface-container-lowest">
      {/* Left panel - branding */}
      <div className="hidden lg:col-span-5 bg-gradient-to-b from-primary to-[#581c87] text-white p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="relative z-10 space-y-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-headline font-bold text-xl text-white">Aura</span>
              <span className="block text-[8px] font-mono tracking-widest text-outline-variant -mt-1 uppercase">Messaging</span>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-headline font-bold text-3xl text-white leading-tight">
              Get started free
            </h2>
            <p className="text-outline-variant text-sm leading-relaxed">
              Create your organizational account, connect your WhatsApp phone numbers, and unlock shared inbox team utilities in minutes.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <InboxIcon className="w-5 h-5 shrink-0 text-primary-fixed" />
              <span className="text-sm font-semibold">Unified team inbox for WhatsApp</span>
            </div>
            <div className="flex items-center gap-4">
              <Sparkles className="w-5 h-5 shrink-0 text-primary-fixed" />
              <span className="text-sm font-semibold">Automated workflows & AI replies</span>
            </div>
            <div className="flex items-center gap-4">
              <Layers className="w-5 h-5 shrink-0 text-primary-fixed" />
              <span className="text-sm font-semibold">Analytics & CRM pipeline</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-white/5 border border-white/10 p-5 rounded-xl">
          <p className="text-xs italic mb-2">
            "Aura has completely transformed our customer operations. Response times are down by 60%."
          </p>
          <p className="font-bold text-[10px] uppercase font-mono tracking-wider text-outline-variant">Sarah Chen — Head of CX, RetailMax</p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-8">
          <div className="space-y-2">
            <h1 className="font-headline font-bold text-3xl text-on-surface">Create an account</h1>
            <p className="text-on-surface-variant text-sm">Start your 14-day free trial</p>
          </div>

          {error && (
            <div className="bg-error-container text-error text-xs p-4 rounded-lg font-semibold border border-error/10">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
              />
              <Input
                label="Last Name"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@company.com"
            />

            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Min. 8 characters"
            />

            <Input
              label="Organization Name"
              type="text"
              required
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              placeholder="Acme Corp"
            />

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                className="rounded text-primary focus:ring-primary border-outline-variant/60 w-4.5 h-4.5 mt-0.5"
              />
              <span className="text-xs text-on-surface-variant leading-relaxed">
                I agree to the Terms of Service and consent to receiving marketing communications.
              </span>
            </label>

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-outline-variant/30"></div>
            <span className="flex-shrink mx-4 text-outline font-mono text-[10px] uppercase">or</span>
            <div className="flex-grow border-t border-outline-variant/30"></div>
          </div>

          <Button variant="outline" fullWidth className="gap-2">
            Continue with Google
          </Button>

          <p className="text-center text-xs text-on-surface-variant">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary-container font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InboxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}
