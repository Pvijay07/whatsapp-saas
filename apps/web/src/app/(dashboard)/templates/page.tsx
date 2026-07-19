'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Plus, Search, Eye, AlertCircle } from 'lucide-react';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';

interface TemplateRow {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  components: any[];
  rejectionReason: string | null;
}

const MOCK_TEMPLATES: TemplateRow[] = [
  {
    id: 'tpl_1',
    name: 'welcome_message',
    category: 'MARKETING',
    language: 'en',
    status: 'APPROVED',
    components: [{ type: 'BODY', text: 'Welcome to our service! How can we assist you today?' }],
    rejectionReason: null,
  },
  {
    id: 'tpl_2',
    name: 'order_update',
    category: 'UTILITY',
    language: 'en',
    status: 'APPROVED',
    components: [{ type: 'BODY', text: 'Your order {{1}} has been updated. Status: {{2}}.' }],
    rejectionReason: null,
  },
  {
    id: 'tpl_3',
    name: 'otp_verification',
    category: 'AUTHENTICATION',
    language: 'en',
    status: 'PENDING',
    components: [{ type: 'BODY', text: 'Use code {{1}} to verify your account.' }],
    rejectionReason: null,
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateRow[]>(MOCK_TEMPLATES);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'MARKETING' as 'MARKETING' | 'UTILITY' | 'AUTHENTICATION',
    language: 'en',
    bodyText: '',
  });

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateRow | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3001/api/templates', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTemplates(data);
      })
      .catch(() => {});
  }, []);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = {
      name: formData.name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      category: formData.category,
      language: formData.language,
      components: [
        {
          type: 'BODY',
          text: formData.bodyText,
        },
      ],
    };

    try {
      const res = await fetch('http://localhost:3001/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit template');

      setTemplates([data, ...templates]);
      setOpenModal(false);
      setFormData({ name: '', category: 'MARKETING', language: 'en', bodyText: '' });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const syncMetaTemplates = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3001/api/whatsapp/templates/sync', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.templates) setTemplates(data.templates);
      })
      .catch(() => {});
  };

  const columns = [
    {
      header: 'Template Name',
      accessor: (row: TemplateRow) => (
        <span className="font-headline font-bold text-on-surface">{row.name}</span>
      ),
    },
    {
      header: 'Category',
      accessor: (row: TemplateRow) => (
        <Badge variant={row.category === 'MARKETING' ? 'info' : 'neutral'}>{row.category}</Badge>
      ),
    },
    {
      header: 'Language',
      accessor: (row: TemplateRow) => <span className="font-mono text-xs">{row.language}</span>,
    },
    {
      header: 'Status',
      accessor: (row: TemplateRow) => {
        const variant =
          row.status === 'APPROVED' ? 'success' : row.status === 'REJECTED' ? 'error' : 'warning';
        return <Badge variant={variant}>{row.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      accessor: (row: TemplateRow) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(row)}>
          <Eye className="w-4 h-4 mr-1.5" /> Preview
        </Button>
      ),
    },
  ];

  const filtered = templates.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 shrink-0">
        <div>
          <h1 className="font-headline font-bold text-2xl text-on-surface">Templates Manager</h1>
          <p className="text-on-surface-variant text-xs mt-0.5">
            Submit message templates to Meta for approval, and track approval status.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={syncMetaTemplates} className="text-xs py-2.5">
            Sync from Meta
          </Button>
          <Button onClick={() => setOpenModal(true)} className="gap-2 text-xs py-2.5">
            <Plus className="w-4 h-4" /> Create Template
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="relative max-w-sm shrink-0">
        <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="flex-grow">
        <Table columns={columns} data={filtered} keyExtractor={(row) => row.id} />
      </div>

      {/* Preview Modal */}
      {selectedTemplate && (
        <Modal
          isOpen={!!selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          title={`Preview: ${selectedTemplate.name}`}
        >
          <div className="space-y-6">
            {/* Meta rejection info */}
            {selectedTemplate.status === 'REJECTED' && (
              <div className="bg-error-container/30 border border-error/20 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-error shrink-0" />
                <div className="text-xs">
                  <h4 className="font-bold text-on-surface">Template Rejected by Meta</h4>
                  <p className="text-on-surface-variant leading-normal mt-0.5">
                    {selectedTemplate.rejectionReason || 'No reason provided.'}
                  </p>
                </div>
              </div>
            )}

            {/* WhatsApp Phone Mockup preview */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono block">
                Mockup Preview
              </span>
              <div className="bg-[#efeae2] border border-[#d8d3cd] rounded-xl p-4 flex flex-col items-start min-h-[140px] relative justify-center bg-[url('https://user-images.githubusercontent.com/15075759/145196627-bb474fcf-bc08-41eb-bf3f-1d48c8bfaef6.png')] bg-cover">
                <div className="bg-white p-3 rounded-xl max-w-[85%] text-xs shadow-sm space-y-1 text-on-surface leading-relaxed text-left border-b-right-sharp relative">
                  <p className="whitespace-pre-line">
                    {selectedTemplate.components.find((c) => c.type === 'BODY')?.text}
                  </p>
                  <span className="block text-[8px] text-outline text-right font-mono mt-0.5 uppercase">
                    Template: {selectedTemplate.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Template Modal */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} title="Create Message Template">
        <form onSubmit={handleCreateTemplate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form fields */}
          <div className="space-y-5">
            <Input
              label="Template Name (Lowercase, no spaces)"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="welcome_message"
            />

            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-lg p-3 text-sm"
              >
                <option value="MARKETING">Marketing (Offers, Welcome)</option>
                <option value="UTILITY">Utility (Order update, Invoices)</option>
                <option value="AUTHENTICATION">Authentication (OTP codes)</option>
              </select>
            </div>

            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                Language Code
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-lg p-3 text-sm"
              >
                <option value="en">English (en)</option>
                <option value="es">Spanish (es)</option>
                <option value="pt_BR">Portuguese (pt_BR)</option>
              </select>
            </div>

            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                Body Text
              </label>
              <textarea
                required
                rows={4}
                value={formData.bodyText}
                onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
                placeholder="Welcome to our service! How can we assist you today?"
                className="w-full bg-surface-container-lowest border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-lg p-3 text-sm"
              />
            </div>

            <Button type="submit" fullWidth>
              Submit to Meta
            </Button>
          </div>

          {/* Live Preview pane */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono block">
              Live Preview
            </span>
            <div className="bg-[#efeae2] border border-[#d8d3cd] rounded-xl p-4 flex flex-col items-start min-h-[220px] relative justify-center bg-[url('https://user-images.githubusercontent.com/15075759/145196627-bb474fcf-bc08-41eb-bf3f-1d48c8bfaef6.png')] bg-cover">
              <div className="bg-white p-3.5 rounded-xl max-w-[85%] text-xs shadow-sm space-y-1 leading-relaxed text-left relative">
                <p className="whitespace-pre-line text-on-surface">
                  {formData.bodyText || 'Your template message body preview will render here in real-time...'}
                </p>
                <span className="block text-[8px] text-outline text-right font-mono mt-0.5 uppercase">
                  Preview: {formData.category}
                </span>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
