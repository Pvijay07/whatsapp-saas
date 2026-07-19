'use client';

import React, { useEffect, useState } from 'react';
import { Megaphone, Plus, Search, Calendar, Users, Eye, Play, BarChart2, Check, ArrowRight } from 'lucide-react';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';

interface BroadcastRow {
  id: string;
  name: string;
  templateName: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'FAILED';
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  scheduledAt: string | null;
  createdAt: string;
}

const MOCK_BROADCASTS: BroadcastRow[] = [
  {
    id: 'b_1',
    name: 'July Newsletter Promo',
    templateName: 'welcome_message',
    status: 'COMPLETED',
    totalRecipients: 1540,
    sentCount: 1540,
    deliveredCount: 1520,
    readCount: 1102,
    failedCount: 20,
    scheduledAt: null,
    createdAt: '2026-07-18T10:00:00Z',
  },
  {
    id: 'b_2',
    name: 'Scheduled Billing Reminder',
    templateName: 'order_update',
    status: 'SCHEDULED',
    totalRecipients: 420,
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    failedCount: 0,
    scheduledAt: '2026-07-21T09:00:00Z',
    createdAt: '2026-07-19T14:00:00Z',
  },
];

export default function BroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState<BroadcastRow[]>(MOCK_BROADCASTS);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    templateId: '',
    recipientType: 'tags' as 'tags' | 'csv',
    selectedTagId: '',
    csvFile: null as File | null,
    scheduledAt: '',
  });

  const [templates, setTemplates] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedBroadcast, setSelectedBroadcast] = useState<BroadcastRow | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Load actual broadcasts
    fetch('http://localhost:3001/api/broadcasts', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBroadcasts(data);
      })
      .catch(() => {});

    // Load templates
    fetch('http://localhost:3001/api/templates?status=APPROVED', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTemplates(data);
      })
      .catch(() => {});

    // Load tags
    fetch('http://localhost:3001/api/tags', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTags(data);
      })
      .catch(() => {});
  }, []);

  const handleCreateBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = {
      name: formData.name,
      templateId: formData.templateId,
      scheduledAt: formData.scheduledAt || undefined,
      audienceFilter: formData.recipientType === 'tags' ? {
        tags: { include: [formData.selectedTagId] }
      } : undefined,
    };

    try {
      const res = await fetch('http://localhost:3001/api/broadcasts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create broadcast');

      setBroadcasts([data, ...broadcasts]);
      setOpenModal(false);
      setStep(1);
      setFormData({
        name: '',
        templateId: '',
        recipientType: 'tags',
        selectedTagId: '',
        csvFile: null,
        scheduledAt: '',
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const columns = [
    {
      header: 'Campaign Name',
      accessor: (row: BroadcastRow) => (
        <span className="font-headline font-bold text-on-surface">{row.name}</span>
      ),
    },
    {
      header: 'Template Used',
      accessor: (row: BroadcastRow) => <span className="font-mono text-xs">{row.templateName}</span>,
    },
    {
      header: 'Recipients',
      accessor: (row: BroadcastRow) => row.totalRecipients.toLocaleString(),
    },
    {
      header: 'Status',
      accessor: (row: BroadcastRow) => {
        const variant =
          row.status === 'COMPLETED'
            ? 'success'
            : row.status === 'SCHEDULED'
            ? 'info'
            : row.status === 'SENDING'
            ? 'warning'
            : 'neutral';
        return <Badge variant={variant}>{row.status}</Badge>;
      },
    },
    {
      header: 'Delivery Rates',
      accessor: (row: BroadcastRow) => {
        if (row.totalRecipients === 0) return '—';
        const delPct = Math.round((row.deliveredCount / row.totalRecipients) * 100);
        const readPct = Math.round((row.readCount / row.totalRecipients) * 100);
        return (
          <span className="text-xs text-on-surface-variant font-mono">
            Delivered: {delPct}% | Read: {readPct}%
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: (row: BroadcastRow) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedBroadcast(row)}>
            <BarChart2 className="w-4 h-4 mr-1.5" /> Report
          </Button>
        </div>
      ),
    },
  ];

  const filtered = broadcasts.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 shrink-0">
        <div>
          <h1 className="font-headline font-bold text-2xl text-on-surface">Broadcast Campaigns</h1>
          <p className="text-on-surface-variant text-xs mt-0.5">
            Broadcast templates to large lists, track delivery funnels, and manage schedules.
          </p>
        </div>

        <Button onClick={() => setOpenModal(true)} className="gap-2 text-xs py-2.5">
          <Plus className="w-4 h-4" /> Create Campaign
        </Button>
      </div>

      {/* Filter and search */}
      <div className="relative max-w-sm shrink-0">
        <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="flex-grow">
        <Table columns={columns} data={filtered} keyExtractor={(row) => row.id} />
      </div>

      {/* Broadcast Funnel Report Modal */}
      {selectedBroadcast && (
        <Modal
          isOpen={!!selectedBroadcast}
          onClose={() => setSelectedBroadcast(null)}
          title={`Funnel Report: ${selectedBroadcast.name}`}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container p-4 rounded-xl text-center space-y-1.5">
                <span className="text-[9px] font-mono text-outline uppercase tracking-wider">Recipients</span>
                <p className="font-headline font-bold text-lg">{selectedBroadcast.totalRecipients}</p>
              </div>
              <div className="bg-surface-container p-4 rounded-xl text-center space-y-1.5">
                <span className="text-[9px] font-mono text-outline uppercase tracking-wider">Sent</span>
                <p className="font-headline font-bold text-lg text-primary">{selectedBroadcast.sentCount}</p>
              </div>
              <div className="bg-surface-container p-4 rounded-xl text-center space-y-1.5">
                <span className="text-[9px] font-mono text-outline uppercase tracking-wider">Delivered</span>
                <p className="font-headline font-bold text-lg text-status-success">{selectedBroadcast.deliveredCount}</p>
              </div>
              <div className="bg-surface-container p-4 rounded-xl text-center space-y-1.5">
                <span className="text-[9px] font-mono text-outline uppercase tracking-wider">Read</span>
                <p className="font-headline font-bold text-lg text-accent-gold">{selectedBroadcast.readCount}</p>
              </div>
            </div>

            {/* Visual Funnel Bar */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono block">
                Funnel Conversion Rates
              </span>
              <div className="space-y-3">
                {/* Sent Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span>Sent Rate</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                {/* Delivered Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span>Delivery Rate</span>
                    <span>
                      {selectedBroadcast.totalRecipients > 0
                        ? Math.round((selectedBroadcast.deliveredCount / selectedBroadcast.totalRecipients) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-status-success h-full"
                      style={{
                        width: `${
                          selectedBroadcast.totalRecipients > 0
                            ? (selectedBroadcast.deliveredCount / selectedBroadcast.totalRecipients) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Read Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span>Read Rate</span>
                    <span>
                      {selectedBroadcast.totalRecipients > 0
                        ? Math.round((selectedBroadcast.readCount / selectedBroadcast.totalRecipients) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-accent-gold h-full"
                      style={{
                        width: `${
                          selectedBroadcast.totalRecipients > 0
                            ? (selectedBroadcast.readCount / selectedBroadcast.totalRecipients) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Broadcast Campaign Modal (Multi-step flow) */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} title="Create Broadcast Campaign">
        <form onSubmit={handleCreateBroadcast} className="space-y-6">
          {step === 1 && (
            <div className="space-y-5">
              <Input
                label="Campaign / Broadcast Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="August Promo Campaign"
              />

              <div className="space-y-1.5 w-full">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                  Select Pre-approved Template
                </label>
                <select
                  required
                  value={formData.templateId}
                  onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 focus:border-primary focus:ring-1 focus:ring-primary/10 rounded-lg p-3 text-sm"
                >
                  <option value="">-- Choose Template --</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} ({tpl.language})
                    </option>
                  ))}
                  {/* Fallback mock template */}
                  {templates.length === 0 && (
                    <>
                      <option value="tpl_1">welcome_message (en)</option>
                      <option value="tpl_2">order_update (en)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.templateId}
                  className="gap-1.5 text-xs"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1.5 w-full">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                  Target Audience
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`p-4 border rounded-xl cursor-pointer text-center space-y-2 flex flex-col items-center justify-center ${
                      formData.recipientType === 'tags' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-outline-variant/60 bg-background'
                    }`}
                  >
                    <input
                      type="radio"
                      name="recipientType"
                      checked={formData.recipientType === 'tags'}
                      onChange={() => setFormData({ ...formData, recipientType: 'tags' })}
                      className="sr-only"
                    />
                    <Users className="w-6 h-6 text-primary" />
                    <span className="font-bold text-xs">Filter by Tag</span>
                  </label>
                  <label
                    className={`p-4 border rounded-xl cursor-pointer text-center space-y-2 flex flex-col items-center justify-center ${
                      formData.recipientType === 'csv' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-outline-variant/60 bg-background'
                    }`}
                  >
                    <input
                      type="radio"
                      name="recipientType"
                      checked={formData.recipientType === 'csv'}
                      onChange={() => setFormData({ ...formData, recipientType: 'csv' })}
                      className="sr-only"
                    />
                    <Megaphone className="w-6 h-6 text-primary" />
                    <span className="font-bold text-xs">CSV Upload</span>
                  </label>
                </div>
              </div>

              {formData.recipientType === 'tags' ? (
                <div className="space-y-1.5 w-full">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                    Select Recipient Tag
                  </label>
                  <select
                    value={formData.selectedTagId}
                    onChange={(e) => setFormData({ ...formData, selectedTagId: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 focus:border-primary focus:ring-1 focus:ring-primary/10 rounded-lg p-3 text-sm"
                  >
                    <option value="">-- Choose Tag --</option>
                    {tags.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                    {/* Fallback mock tags */}
                    {tags.length === 0 && (
                      <>
                        <option value="t_1">VIP Customer</option>
                        <option value="t_2">Sales Lead</option>
                      </>
                    )}
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5 w-full">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                    Upload CSV Database File
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) =>
                      setFormData({ ...formData, csvFile: e.target.files?.[0] || null })
                    }
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 focus:border-primary rounded-lg p-3 text-xs"
                  />
                  <p className="text-[10px] text-outline">
                    CSV file must contain a column labeled "phone" or "waId" with E.164 numbers.
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" type="button" onClick={() => setStep(1)} className="text-xs">
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={formData.recipientType === 'tags' ? !formData.selectedTagId : !formData.csvFile}
                  className="gap-1.5 text-xs"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <Input
                label="Scheduled Dispatch Time (Leave empty to send immediately)"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              />

              <div className="bg-surface-container-low p-4 rounded-xl text-xs space-y-2">
                <h4 className="font-bold text-on-surface uppercase tracking-wider font-mono">Campaign Summary</h4>
                <p><span className="font-semibold">Name:</span> {formData.name}</p>
                <p>
                  <span className="font-semibold">Audience:</span>{' '}
                  {formData.recipientType === 'tags' ? 'Filtered Tag Contacts' : 'CSV File list'}
                </p>
                <p>
                  <span className="font-semibold">Schedule:</span>{' '}
                  {formData.scheduledAt ? new Date(formData.scheduledAt).toLocaleString() : 'Immediate send'}
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" type="button" onClick={() => setStep(2)} className="text-xs">
                  Back
                </Button>
                <Button type="submit" className="text-xs">
                  Create & Launch Campaign
                </Button>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
