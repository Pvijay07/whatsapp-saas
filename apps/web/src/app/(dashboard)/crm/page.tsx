'use client';

import React, { useEffect, useState } from 'react';
import { Network, Plus, Search, ChevronRight, Check, DollarSign, Tag, ArrowRight, User } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';

interface Deal {
  id: string;
  title: string;
  value: number;
  stageId: string;
  contact: {
    id: string;
    name: string;
    waId: string;
  };
  lastActivity: string;
}

interface Stage {
  id: string;
  name: string;
  color: string;
}

const STAGES: Stage[] = [
  { id: 'st_lead', name: 'Lead', color: '#6c7a75' },
  { id: 'st_qualified', name: 'Qualified', color: '#FAB534' },
  { id: 'st_proposal', name: 'Proposal', color: '#05a68b' },
  { id: 'st_negotiation', name: 'Negotiation', color: '#006b59' },
  { id: 'st_won', name: 'Won', color: '#10B981' },
  { id: 'st_lost', name: 'Lost', color: '#EF4444' },
];

const MOCK_DEALS: Deal[] = [
  {
    id: 'd_1',
    title: 'Enterprise Inbox License 10 Seats',
    value: 1490,
    stageId: 'st_proposal',
    contact: { id: 'cont_1', name: 'Sophia Martinez', waId: '15550192834' },
    lastActivity: 'Proposal sent 1d ago',
  },
  {
    id: 'd_2',
    title: 'WABA Setup & Broadcaster integration',
    value: 500,
    stageId: 'st_lead',
    contact: { id: 'cont_2', name: 'David Chen', waId: '15550198822' },
    lastActivity: 'Inbound inquiry received',
  },
];

export default function CrmPage() {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    contactName: '',
    waId: '',
    stageId: 'st_lead',
  });

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Load actual deals from API
    fetch('http://localhost:3001/api/crm/deals', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDeals(data);
      })
      .catch(() => {});
  }, []);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    // Create a mock layout to save
    const payload = {
      title: formData.title,
      value: parseFloat(formData.value) || 0,
      stageId: formData.stageId,
      contactName: formData.contactName,
      waId: formData.waId,
    };

    try {
      const res = await fetch('http://localhost:3001/api/crm/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create deal');

      setDeals([...deals, data]);
      setOpenModal(false);
      setFormData({ title: '', value: '', contactName: '', waId: '', stageId: 'st_lead' });
    } catch (err: any) {
      // Mock success fallback for offline testing
      const nextId = `d_${Date.now()}`;
      const mockNewDeal: Deal = {
        id: nextId,
        title: formData.title,
        value: parseFloat(formData.value) || 0,
        stageId: formData.stageId,
        contact: { id: `cont_${Date.now()}`, name: formData.contactName, waId: formData.waId },
        lastActivity: 'Deal opened manually',
      };
      setDeals([...deals, mockNewDeal]);
      setOpenModal(false);
      setFormData({ title: '', value: '', contactName: '', waId: '', stageId: 'st_lead' });
    }
  };

  const handleMoveStage = (dealId: string, stageId: string) => {
    setDeals(
      deals.map((d) => (d.id === dealId ? { ...d, stageId, lastActivity: `Moved stage 1m ago` } : d)),
    );

    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`http://localhost:3001/api/crm/deals/${dealId}/stage`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stageId }),
    }).catch(() => {});
  };

  const filteredDeals = deals.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.contact.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 shrink-0">
        <div>
          <h1 className="font-headline font-bold text-2xl text-on-surface">CRM Pipeline Board</h1>
          <p className="text-on-surface-variant text-xs mt-0.5">
            Log deals directly from WhatsApp chat threads, set sales metrics, and route pipeline stages.
          </p>
        </div>

        <Button onClick={() => setOpenModal(true)} className="gap-2 text-xs py-2.5">
          <Plus className="w-4 h-4" /> Add Custom Deal
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="relative max-w-sm shrink-0">
        <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search deals or contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Kanban Layout Scroll Wrapper */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden flex gap-4 pb-4 select-none">
        {STAGES.map((stage) => {
          const stageDeals = filteredDeals.filter((d) => d.stageId === stage.id);
          const totalVal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={stage.id}
              className="w-[280px] bg-surface-container-low/40 border border-outline-variant/40 rounded-xl flex flex-col h-full shrink-0"
            >
              {/* Stage Header */}
              <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: stage.color }}
                    className="w-3 h-3 rounded-full shrink-0"
                  ></div>
                  <span className="font-headline font-bold text-xs text-on-surface">{stage.name}</span>
                  <span className="text-[10px] text-outline bg-surface-container px-1.5 py-0.5 rounded font-bold font-mono">
                    {stageDeals.length}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-primary">${totalVal.toLocaleString()}</span>
              </div>

              {/* Stage Cards Loop */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => setSelectedDeal(deal)}
                    className="bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 rounded-lg p-4 shadow-sm space-y-3 cursor-pointer hover:shadow transition-all duration-150"
                  >
                    <div className="space-y-1.5 text-left">
                      <h4 className="font-bold text-xs text-on-surface line-clamp-2">{deal.title}</h4>
                      <p className="text-[10px] text-on-surface-variant font-medium">
                        Client: {deal.contact.name}
                      </p>
                    </div>

                    <div className="flex justify-between items-baseline pt-2 border-t border-outline-variant/10">
                      <span className="text-[10px] text-outline font-mono truncate max-w-[120px]">
                        {deal.lastActivity}
                      </span>
                      <span className="font-headline font-bold text-xs text-primary">${deal.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deal Detail Panel */}
      {selectedDeal && (
        <Modal
          isOpen={!!selectedDeal}
          onClose={() => setSelectedDeal(null)}
          title={`Deal Details: ${selectedDeal.title}`}
        >
          <div className="space-y-6 text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                  Deal Value
                </span>
                <span className="font-headline font-bold text-xl text-primary">
                  ${selectedDeal.value.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono block">
                  Associated Contact
                </span>
                <div className="flex items-center gap-3 bg-surface-container p-3 rounded-lg border border-outline-variant/10 text-xs">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {selectedDeal.contact.name[0]}
                  </div>
                  <div>
                    <p className="font-bold">{selectedDeal.contact.name}</p>
                    <p className="text-outline font-mono">+{selectedDeal.contact.waId}</p>
                  </div>
                </div>
              </div>

              {/* Move stage control */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono block">
                  Workflow Pipeline Stage
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {STAGES.map((stage) => {
                    const isCurrent = stage.id === selectedDeal.stageId;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => handleMoveStage(selectedDeal.id, stage.id)}
                        className={`p-2 rounded text-[10px] font-bold text-center border transition-all ${
                          isCurrent
                            ? 'bg-primary text-white border-primary shadow'
                            : 'bg-background hover:bg-surface-container text-on-surface-variant border-outline-variant/40'
                        }`}
                      >
                        {stage.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Deal Modal */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} title="Log Pipeline Deal Card">
        <form onSubmit={handleCreateDeal} className="space-y-5">
          <Input
            label="Deal Title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enterprise Inbox License 10 Seats"
          />

          <Input
            label="Deal Value ($)"
            type="number"
            required
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder="1490"
          />

          <Input
            label="Associated Contact Full Name"
            type="text"
            required
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            placeholder="Sophia Martinez"
          />

          <Input
            label="Contact Phone / WhatsApp ID"
            type="text"
            required
            value={formData.waId}
            onChange={(e) => setFormData({ ...formData, waId: e.target.value })}
            placeholder="15550192834"
          />

          <div className="space-y-1.5 w-full">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
              Pipeline Stage
            </label>
            <select
              value={formData.stageId}
              onChange={(e) => setFormData({ ...formData, stageId: e.target.value })}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 focus:border-primary focus:ring-1 focus:ring-primary/10 rounded-lg p-3 text-sm"
            >
              {STAGES.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" fullWidth>
            Create Deal
          </Button>
        </form>
      </Modal>
    </div>
  );
}
