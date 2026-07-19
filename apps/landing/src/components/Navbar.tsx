'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-300 animate-fade-in ${
        scrolled
          ? 'bg-[#111111]/90 backdrop-blur-md border-b border-[#27272a] py-4'
          : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-headline font-normal text-2xl text-white tracking-wide">Aura</span>
          </Link>

          {/* Desktop Nav & Actions */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              <Link href="/features" className="text-[#a1a1aa] hover:text-white transition-colors text-sm font-light">
                Features
              </Link>
              <Link href="/pricing" className="text-[#a1a1aa] hover:text-white transition-colors text-sm font-light">
                Pricing
              </Link>
              <Link href="/about" className="text-[#a1a1aa] hover:text-white transition-colors text-sm font-light">
                About
              </Link>
              <Link href="/contact" className="text-[#a1a1aa] hover:text-white transition-colors text-sm font-light">
                Contact
              </Link>
            </div>
            
            <a
              href="http://localhost:3000/login"
              className="elite-btn-outline"
            >
              Sign In
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#a1a1aa] hover:text-white p-2 rounded-lg focus:outline-none"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#111111] border-b border-[#27272a] px-4 pt-4 pb-6 space-y-4">
          <Link
            href="/features"
            onClick={() => setIsOpen(false)}
            className="block text-[#a1a1aa] hover:text-white text-base font-light"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            onClick={() => setIsOpen(false)}
            className="block text-[#a1a1aa] hover:text-white text-base font-light"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block text-[#a1a1aa] hover:text-white text-base font-light"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block text-[#a1a1aa] hover:text-white text-base font-light"
          >
            Contact
          </Link>
          <div className="pt-4 mt-2 border-t border-[#27272a]">
            <a
              href="http://localhost:3000/login"
              className="elite-btn-outline block text-center mt-4 w-full"
            >
              Sign In
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
