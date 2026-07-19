'use client';

import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import CtaBanner from '../../components/CtaBanner';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Complete Guide to WhatsApp Business API in 2026',
    excerpt: 'Everything you need to know about setting up, managing, and scaling your WhatsApp Business presence using Meta’s official APIs.',
    category: 'WhatsApp API',
    date: 'July 18, 2026',
    readTime: '8 min read',
    author: 'Michael Adams',
    featured: true,
  },
  {
    id: 2,
    title: 'How to Set Up WhatsApp Embedded Signup',
    excerpt: 'Step-by-step documentation on deploying the official OAuth popup for frictionless WABA onboarding.',
    category: 'Getting Started',
    date: 'July 15, 2026',
    readTime: '5 min read',
    author: 'Sarah Jenkins',
    featured: false,
  },
  {
    id: 3,
    title: '5 Broadcast Campaign Templates That Convert',
    excerpt: 'Tested copy layouts and formatting rules for high-engagement marketing broadcasts without triggering spam flags.',
    category: 'Best Practices',
    date: 'July 10, 2026',
    readTime: '6 min read',
    author: 'Marcus Vance',
    featured: false,
  },
  {
    id: 4,
    title: 'RetailMax Case Study: 60% Faster Response Times',
    excerpt: 'How a scaling retail brand centralized customer operations using Aura’s 3-column shared inbox.',
    category: 'Case Studies',
    date: 'July 05, 2026',
    readTime: '4 min read',
    author: 'Sophia Martinez',
    featured: false,
  },
  {
    id: 5,
    title: 'Building WhatsApp Chatbots with Workflow Automation',
    excerpt: 'Configure linear conditional loops to answer support requests instantly without writing any code.',
    category: 'Best Practices',
    date: 'June 28, 2026',
    readTime: '7 min read',
    author: 'Elena Rostova',
    featured: false,
  },
  {
    id: 6,
    title: 'New Feature release: AI reply suggestions are live',
    excerpt: 'Learn how to upload document FAQ indices to draft contextual AI reply suggestions directly in the composer.',
    category: 'Product Updates',
    date: 'June 20, 2026',
    readTime: '3 min read',
    author: 'David Chen',
    featured: false,
  },
  {
    id: 7,
    title: 'Understanding WhatsApp Conversation-Based Pricing',
    excerpt: 'Demystifying utility, authentication, and marketing category costs on the Meta Cloud API.',
    category: 'WhatsApp API',
    date: 'June 12, 2026',
    readTime: '6 min read',
    author: 'Michael Adams',
    featured: false,
  },
];

const CATEGORIES = [
  'All',
  'Getting Started',
  'Best Practices',
  'Case Studies',
  'Product Updates',
  'WhatsApp API',
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedCategory === 'All') return true;
    return post.category === selectedCategory;
  });

  const featuredPost = BLOG_POSTS.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured || selectedCategory !== 'All');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="relative grid-bg min-h-screen">
      {/* Background Mesh Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] mesh-glow-1 -z-10 opacity-60"></div>
      <div className="absolute top-[30%] right-1/4 w-[600px] h-[600px] mesh-glow-2 -z-10 opacity-50"></div>
      
      {/* Header */}
      <section className="relative py-20 text-center max-w-4xl mx-auto px-4 z-10">
        <h1 className="font-headline font-black text-4xl sm:text-5xl lg:text-6xl mb-6 text-white tracking-tight">
          Resources & <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary">Insights</span>
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl leading-relaxed font-light">
          Learn how to grow your business, automate support, and scale conversions with WhatsApp.
        </p>

        {/* Filter pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                selectedCategory === cat
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      {selectedCategory === 'All' && featuredPost && (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 z-10">
          <div className="glass-card rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 md:p-8 hover:-translate-y-1 transition-all duration-300">
            <div className="lg:col-span-7 bg-[#0f172a]/50 rounded-xl h-[300px] flex items-center justify-center font-mono text-slate-500 text-xs border border-white/5">
              [ Featured Post Image Cover ]
            </div>
            <div className="lg:col-span-5 space-y-6">
              <span className="bg-primary/20 border border-primary/30 text-primary-fixed font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {featuredPost.category}
              </span>
              <h2 className="font-headline font-bold text-2xl sm:text-3xl leading-snug text-white">
                {featuredPost.title}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" /> {featuredPost.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {featuredPost.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {featuredPost.readTime}
                </span>
              </div>
              <button className="inline-flex items-center gap-2 text-tertiary hover:text-white transition-colors font-bold text-sm">
                Read Full Article <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Grid Posts */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 z-10">
        {regularPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between p-6"
              >
                <div className="space-y-4">
                  <div className="bg-[#0f172a]/50 rounded-lg h-[160px] flex items-center justify-center font-mono text-slate-500 text-[10px] mb-4 border border-white/5">
                    [ Blog Thumbnail ]
                  </div>
                  <span className="inline-block bg-primary/20 border border-primary/30 text-primary-fixed font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h3 className="font-headline font-bold text-lg leading-snug line-clamp-2 text-white">
                    {post.title}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-4">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                  <button className="inline-flex items-center gap-1.5 text-tertiary hover:text-white transition-colors font-bold text-xs">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card rounded-2xl">
            <p className="text-slate-400 text-base">No articles found in this category.</p>
          </div>
        )}
      </section>

      {/* Newsletter signup */}
      <section className="relative py-24 border-t border-white/5 bg-[#0b0f19]/80 backdrop-blur-sm z-10">
        <div className="max-w-xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-headline font-bold text-2xl sm:text-3xl text-white">Stay in the loop</h2>
          <p className="text-slate-300 text-sm leading-relaxed font-light">
            Get the latest WhatsApp marketing tips, case studies, and product guides delivered straight to your inbox.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg p-3 text-sm text-white placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 active:scale-95"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 p-4 rounded-lg text-sm font-semibold">
              ✓ Thanks for subscribing! Check your email to confirm.
            </div>
          )}
          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">
            Join 5,000+ WhatsApp growth marketers
          </p>
        </div>
      </section>

      {/* CTA */}
      <CtaBanner />
    </div>
  );
}
