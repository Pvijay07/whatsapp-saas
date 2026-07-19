'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserPlus, Check, X, ShieldAlert, Tag, Calendar, User } from 'lucide-react';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';

interface ContactRow {
  id: string;
  name: string;
  waId: string;
  email: string | null;
  optedIn: boolean;
  optedInAt: string | null;
  optedInSource: string | null;
  lastMessageAt: string | null;
  tags: { id: string; name: string; color: string }[];
}

const MOCK_CONTACTS: ContactRow[] = [
  {
    id: 'cont_1',
    name: 'Sophia Martinez',
    waId: '15550192834',
    email: 'sophia@retailmax.com',
    optedIn: true,
    optedInAt: '2026-07-15T10:00:00Z',
    optedInSource: 'Web Form',
    lastMessageAt: '2026-07-19T11:30:00Z',
    tags: [{ id: 't_1', name: 'VIP Customer', color: '#006b59' }],
  },
  {
    id: 'cont_2',
    name: 'David Chen',
    waId: '15550198822',
    email: 'david@growthco.com',
    optedIn: true,
    optedInAt: '2026-07-16T12:00:00Z',
    optedInSource: 'Inbound Message',
    lastMessageAt: '2026-07-18T10:15:00Z',
    tags: [{ id: 't_2', name: 'Sales Lead', color: '#FAB534' }],
  },
  {
    id: 'cont_3',
    name: 'Emma Watson',
    waId: '14440194455',
    email: 'emma@watson.co',
    optedIn: false,
    optedInAt: null,
    optedInSource: null,
    lastMessageAt: '2026-07-14T09:00:00Z',
    tags: [],
  },
];

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactRow[]>(MOCK_CONTACTS);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', waId: '', email: '', optedIn: true });
  const [selectedContact, setSelectedContact] = useState<ContactRow | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3001/api/contacts', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setContacts(data.data);
      })
      .catch(() => {});
  }, []);

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = {
      waId: formData.waId,
      name: formData.name,
      email: formData.email || undefined,
      optedIn: formData.optedIn,
      optedInSource: formData.optedIn ? 'Manual' : undefined,
    };

    try {
      const res = await fetch('http://localhost:3001/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create contact');

      setContacts([data, ...contacts]);
      setOpenModal(false);
      setFormData({ name: '', waId: '', email: '', optedIn: true });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const selectContactRow = (contact: ContactRow) => {
    setSelectedContact(contact);
  };

  const columns = [
    {
      header: 'Name',
      accessor: (row: ContactRow) => (
        <button
          onClick={() => selectContactRow(row)}
          className="font-bold text-primary hover:underline hover:text-primary-container text-left"
        >
          {row.name || 'WhatsApp Contact'}
        </button>
      ),
    },
    {
      header: 'Phone Number',
      accessor: (row: ContactRow) => `+${row.waId}`,
    },
    {
      header: 'Email',
      accessor: (row: ContactRow) => row.email || <span className="text-outline">—</span>,
    },
    {
      header: 'Consent Status',
      accessor: (row: ContactRow) => (
        <Badge variant={row.optedIn ? 'success' : 'neutral'}>
          {row.optedIn ? 'Opted In' : 'No Consent'}
        </Badge>
      ),
    },
    {
      header: 'Last Message',
      accessor: (row: ContactRow) =>
        row.lastMessageAt ? new Date(row.lastMessageAt).toLocaleDateString() : 'Never',
    },
    {
      header: 'Tags',
      accessor: (row: ContactRow) => (
        <div className="flex gap-1">
          {row.tags.map((t) => (
            <span
              key={t.id}
              style={{ backgroundColor: `${t.color}15`, color: t.color }}
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono"
            >
              {t.name}
            </span>
          ))}
        </div>
      ),
    },
  ];

  const filtered = contacts.filter((c) => {
    const s = search.toLowerCase();
    return c.name.toLowerCase().includes(s) || c.waId.includes(s);
  });

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 shrink-0">
        <div>
          <h1 className="font-headline font-bold text-2xl text-on-surface">Contacts Manager</h1>
          <p className="text-on-surface-variant text-xs mt-0.5">
            Add contacts, verify consent compliance, and filter audiences.
          </p>
        </div>

        <Button onClick={() => setOpenModal(true)} className="gap-2 text-xs py-2.5">
          <UserPlus className="w-4 h-4" /> Add Contact
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative max-w-sm shrink-0">
        <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Main Table */}
      <div className="flex-1">
        <Table columns={columns} data={filtered} keyExtractor={(row) => row.id} />
      </div>

      {/* Contact Drawer Panel */}
      {selectedContact && (
        <div className="fixed top-0 right-0 z-40 w-[360px] h-screen bg-surface-container-lowest border-l border-outline-variant/60 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-250">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-sm uppercase tracking-wider font-mono text-outline">
                Contact Profile Detail
              </h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-on-surface-variant hover:text-on-surface text-sm font-semibold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                  {selectedContact.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-base text-on-surface">{selectedContact.name}</h4>
                  <p className="text-xs text-outline font-mono">+{selectedContact.waId}</p>
                </div>
              </div>

              {selectedContact.email && (
                <div className="text-xs">
                  <span className="text-outline uppercase font-mono text-[10px] tracking-wider block mb-1">
                    Email Address
                  </span>
                  <span className="text-on-surface font-semibold">{selectedContact.email}</span>
                </div>
              )}
            </div>

            <hr className="border-outline-variant/30" />

            {/* Opt in details */}
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-on-surface-variant">Opt-In Consent</span>
                <Badge variant={selectedContact.optedIn ? 'success' : 'neutral'}>
                  {selectedContact.optedIn ? 'Opted In' : 'No Consent'}
                </Badge>
              </div>

              {selectedContact.optedIn && (
                <div className="space-y-2 pt-2 border-t border-outline-variant/10 text-[11px] font-mono text-outline">
                  <div className="flex justify-between">
                    <span>Source:</span>
                    <span className="text-on-surface-variant font-semibold">
                      {selectedContact.optedInSource}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consent Timestamp:</span>
                    <span className="text-on-surface-variant font-semibold">
                      {selectedContact.optedInAt
                        ? new Date(selectedContact.optedInAt).toLocaleString()
                        : 'Unknown'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono block">
                Contact Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedContact.tags.map((t) => (
                  <span
                    key={t.id}
                    style={{ backgroundColor: `${t.color}15`, color: t.color }}
                    className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
                  >
                    <Tag className="w-3.5 h-3.5 fill-current" />
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant/10 pt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => router.push(`/inbox?chat=${selectedContact.id}`)}
              className="gap-1.5"
            >
              Open Inbox chat
            </Button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} title="Create Contact Profile">
        <form onSubmit={handleCreateContact} className="space-y-5">
          <Input
            label="Phone Number (E.164 without +)"
            type="text"
            required
            value={formData.waId}
            onChange={(e) => setFormData({ ...formData, waId: e.target.value })}
            placeholder="15550192834"
          />

          <Input
            label="Full Name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Sophia Martinez"
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="sophia@company.com"
          />

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.optedIn}
              onChange={(e) => setFormData({ ...formData, optedIn: e.target.checked })}
              className="rounded text-primary focus:ring-primary border-outline-variant/60 w-4.5 h-4.5"
            />
            <span className="text-xs text-on-surface-variant font-semibold">
              Verify compliance: customer has opted-in to receive marketing messages.
            </span>
          </label>

          <Button type="submit" fullWidth>
            Create Profile
          </Button>
        </form>
      </Modal>
    </div>
  );
}
