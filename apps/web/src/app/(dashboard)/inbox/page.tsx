'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Type,
  Send,
  ChevronRight,
  Clock,
  Tag,
  Image as ImageIcon,
  User as UserIcon,
  MessageSquare,
  Edit,
} from 'lucide-react';

const MOCK_CONVERSATIONS = [
  { id: '1', name: 'Project Phoenix', sub: 'Customer project of the public...', status: 'Status', avatar: 'P' },
  { id: '2', name: 'Executive Team', sub: 'Executive team, board project...', status: 'Status', avatar: 'E' },
  { id: '3', name: 'Executive Team', sub: 'Executive team', status: 'Status', avatar: 'E' },
  { id: '4', name: 'Project Phoenix', sub: 'Executive team, promote the...', status: 'Status', avatar: 'P' },
  { id: '5', name: 'Client: Apex Global', sub: 'I\'ve highlighted the key performance...', status: 'Online', avatar: 'A', isActive: true },
  { id: '6', name: 'Aura Admin', sub: 'Aura Admin : Adict has so...', time: '10:30 AM', avatar: 'A' },
  { id: '7', name: 'Aura Admin', sub: 'The Q4 reports are ready...', time: '10:30 AM', avatar: 'A' },
  { id: '8', name: 'Apex Global', sub: 'Project Phoenix', time: '10:32 AM', avatar: 'A' },
  { id: '9', name: 'Aura Admin', sub: 'I\'ve highlighted the key pe...', time: '10:33 AM', avatar: 'A' },
];

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState('Active');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, []);

  return (
    <div className="flex h-full w-full bg-[#121316] text-[#e2e8f0] font-sans selection:bg-blue-500/30">
      
      {/* 1. Chat List Column (Secondary Sidebar) */}
      <div className="w-[320px] shrink-0 border-r border-[#2d2f36] bg-[#181a1f] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <h2 className="font-bold text-lg text-white">Aura Workspace</h2>
          <button className="p-2 hover:bg-[#2d2f36] rounded-md transition-colors text-slate-400 hover:text-white">
            <Edit className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#121316] border border-[#2d2f36] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-2">
          <div className="flex bg-[#121316] p-1 rounded-lg">
            {['Active', 'Pending', 'Archived'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === tab
                    ? 'bg-[#2d2f36] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {MOCK_CONVERSATIONS.map((conv) => (
            <div
              key={conv.id}
              className={`flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer transition-colors relative group ${
                conv.isActive ? 'bg-[#21232a]' : 'hover:bg-[#21232a]/50'
              }`}
            >
              {conv.isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-blue-500 rounded-r-full" />
              )}
              
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${
                conv.isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-[#2d2f36] text-slate-400'
              }`}>
                {conv.avatar}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className={`font-semibold text-sm truncate pr-2 ${conv.isActive ? 'text-blue-400' : 'text-slate-200'}`}>
                    {conv.name}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    {conv.status === 'Online' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                    {conv.status === 'Status' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                    <span className="text-[10px] text-slate-500">{conv.time || conv.status}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 truncate">{conv.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Chat Column */}
      <div className="flex-1 flex flex-col bg-[#121316] relative animate-fade-in" style={{ animationDelay: '100ms' }}>
        {/* Header */}
        <div className="h-[72px] shrink-0 border-b border-[#2d2f36] bg-[#181a1f] flex items-center justify-between px-6">
          <div>
            <h2 className="font-bold text-lg text-white">Client: Apex Global - Q4 Strategy</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-slate-400">Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#2d2f36] rounded-md transition-colors text-slate-400 hover:text-white">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-[#2d2f36] rounded-md transition-colors text-slate-400 hover:text-white">
              <Video className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-[#2d2f36] mx-2"></div>
            <button className="p-2 hover:bg-[#2d2f36] rounded-md transition-colors text-slate-400 hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Admin Message (Left) */}
          <div className="flex flex-col items-start max-w-[70%]">
            <div className="bg-[#181a1f] border border-[#2d2f36] rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-xs font-semibold text-slate-400 mb-1">Aura Admin</p>
              <p className="text-sm text-slate-200 leading-relaxed">
                The Q4 reports are ready for review.
              </p>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 ml-1">- 10:30 AM</span>
          </div>

          {/* Client Message (Right) */}
          <div className="flex flex-col items-end self-end max-w-[70%] ml-auto">
            <div className="bg-[#21232a] border border-[#2d2f36] rounded-2xl rounded-tr-sm px-4 py-3">
              <p className="text-xs font-semibold text-blue-400 mb-1">Apex Global (Sarah)</p>
              <p className="text-sm text-slate-200 leading-relaxed">
                Thanks! We'll take a look today. Any critical points?
              </p>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 mr-1">- 10:32 AM</span>
          </div>

          {/* Admin Message (Left) */}
          <div className="flex flex-col items-start max-w-[70%]">
            <div className="bg-[#181a1f] border border-[#2d2f36] rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-xs font-semibold text-slate-400 mb-1">Aura Admin</p>
              <p className="text-sm text-slate-200 leading-relaxed">
                I've highlighted the key performance indicators in the executive summary.
              </p>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 ml-1">- 10:33 AM</span>
          </div>

          <div ref={chatEndRef} />
        </div>

        {/* Composer */}
        <div className="p-4 bg-[#121316]">
          <div className="flex items-center gap-2 bg-[#181a1f] border border-[#2d2f36] rounded-xl px-4 py-3 focus-within:border-blue-500/50 transition-colors">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
              <Paperclip className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
              <Type className="w-4 h-4" />
            </button>
            <button className="p-1.5 ml-1 bg-[#2d2f36] hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-md transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Details Column (Tertiary Sidebar) */}
      <div className="w-[280px] shrink-0 border-l border-[#2d2f36] bg-[#181a1f] flex flex-col animate-fade-in" style={{ animationDelay: '200ms' }}>
        {/* Header padding */}
        <div className="h-[72px] shrink-0 border-b border-[#2d2f36] flex items-center justify-end px-4">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
            A
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <button className="w-full flex items-center justify-between p-4 border-b border-[#2d2f36] hover:bg-[#21232a] transition-colors group">
            <div className="flex items-center gap-3 text-slate-300 group-hover:text-white">
              <UserIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Contact Details</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 border-b border-[#2d2f36] hover:bg-[#21232a] transition-colors group">
            <div className="flex items-center gap-3 text-slate-300 group-hover:text-white">
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Media & Files</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button className="w-full flex items-center justify-between p-4 border-b border-[#2d2f36] hover:bg-[#21232a] transition-colors group">
            <div className="flex items-center gap-3 text-slate-300 group-hover:text-white">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Scheduled Messages</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button className="w-full flex items-center justify-between p-4 border-b border-[#2d2f36] hover:bg-[#21232a] transition-colors group">
            <div className="flex items-center gap-3 text-slate-300 group-hover:text-white">
              <Tag className="w-4 h-4" />
              <span className="text-sm font-medium">Labels</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
