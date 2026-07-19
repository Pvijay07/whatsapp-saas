import React from 'react';
import { Metadata } from 'next';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-headline',
});

const jbMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Aura Workspace — Shared WABA Inboxes & CRM',
  description: 'Manage WABA team inbox channels, broadcast flows, CRM deals, and integrations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jbMono.variable}`}>
      <body className="bg-background text-on-background h-screen w-screen overflow-hidden flex">
        {children}
      </body>
    </html>
  );
}
