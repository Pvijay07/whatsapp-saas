'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  Shield,
  CreditCard,
  Users,
  Plus,
  ShieldCheck,
  History,
  Palette,
  Globe,
  FileDown,
} from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Table from '../../../components/ui/Table';

interface TeamMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'OWNER' | 'AGENT';
  isActive: boolean;
}

interface AuditLogRow {
  id: string;
  actor: string;
  action: string;
  target: string;
  ipAddress: string;
  createdAt: string;
}

const MOCK_AUDIT_LOGS: AuditLogRow[] = [
  { id: 'a_1', actor: 'John Doe (Owner)', action: 'template.create', target: 'welcome_message', ipAddress: '192.168.1.10', createdAt: '2026-07-19T11:20:00Z' },
  { id: 'a_2', actor: 'John Doe (Owner)', action: 'auth.login', target: 'User login', ipAddress: '192.168.1.10', createdAt: '2026-07-19T10:15:00Z' },
  { id: 'a_3', actor: 'Jane Smith (Agent)', action: 'conversation.resolve', target: 'conv_Sophia Martinez', ipAddress: '192.168.1.14', createdAt: '2026-07-18T16:45:00Z' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'billing' | 'sso' | 'branding' | 'audit'>('profile');
  const [orgName, setOrgName] = useState('Acme Corp');
  const [timezone, setTimezone] = useState('UTC');
  const [members, setMembers] = useState<TeamMember[]>([
    { id: 'm_1', email: 'john@acme.com', firstName: 'John', lastName: 'Doe', role: 'OWNER', isActive: true },
    { id: 'm_2', email: 'jane@acme.com', firstName: 'Jane', lastName: 'Smith', role: 'AGENT', isActive: true },
  ]);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'OWNER' | 'AGENT'>('AGENT');

  // Branding states
  const [customDomain, setCustomDomain] = useState('inbox.acme.com');
  const [logoUrl, setLogoUrl] = useState('https://acme.com/logo.png');
  const [primaryColor, setPrimaryColor] = useState('#006b59');
  const [dnsVerified, setDnsVerified] = useState(true);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>(MOCK_AUDIT_LOGS);

  // Plan limits
  const planLimits = {
    name: 'Growth Plan',
    seatsUsed: 2,
    seatsLimit: 10,
    numbersUsed: 1,
    numbersLimit: 3,
    messagesUsed: 3840,
    messagesLimit: 10000,
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Load org details
    fetch('http://localhost:3001/api/organizations/current', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setOrgName(data.name);
          setTimezone(data.timezone);
        }
      })
      .catch(() => {});

    // Load team members
    fetch('http://localhost:3001/api/organizations/members', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMembers(data.map((m: any) => ({
            id: m.id,
            email: m.user.email,
            firstName: m.user.firstName,
            lastName: m.user.lastName,
            role: m.role,
            isActive: m.isActive,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3001/api/organizations/current', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: orgName, timezone }),
      });
      if (res.ok) alert('Settings updated successfully!');
    } catch (err) {}
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3001/api/organizations/members/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMembers([...members, {
        id: data.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.role,
        isActive: data.isActive,
      }]);
      setOpenInviteModal(false);
      setInviteEmail('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    alert('White-label config saved. Domain verification pending DNS refresh.');
  };

  const auditColumns = [
    {
      header: 'Actor',
      accessor: (row: AuditLogRow) => <span className="font-bold text-on-surface">{row.actor}</span>,
    },
    {
      header: 'Action',
      accessor: (row: AuditLogRow) => <Badge variant="info">{row.action}</Badge>,
    },
    {
      header: 'Target Resource',
      accessor: (row: AuditLogRow) => <span className="font-mono text-xs">{row.target}</span>,
    },
    {
      header: 'IP Address',
      accessor: (row: AuditLogRow) => <span className="font-mono text-xs">{row.ipAddress}</span>,
    },
    {
      header: 'Timestamp',
      accessor: (row: AuditLogRow) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* Settings Sub-Sidebar */}
      <div className="w-[220px] border-r border-outline-variant/60 bg-surface-container-lowest shrink-0 p-4 space-y-4">
        <h2 className="font-headline font-bold text-lg px-2">Settings</h2>
        <div className="space-y-1">
          {[
            { id: 'profile', label: 'Organization Profile', icon: Settings },
            { id: 'team', label: 'Team Members', icon: Users },
            { id: 'billing', label: 'Plans & Billing', icon: CreditCard },
            { id: 'sso', label: 'SSO / Access Control', icon: Shield },
            { id: 'branding', label: 'Branding / White-Label', icon: Palette },
            { id: 'audit', label: 'Audit Log Viewer', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-secondary-container text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Settings Pane */}
      <div className="flex-grow p-8 overflow-y-auto max-w-3xl">
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateOrg} className="space-y-6">
            <div>
              <h2 className="font-headline font-bold text-xl mb-1">Organization Profile</h2>
              <p className="text-on-surface-variant text-xs">Configure your primary organization detail settings.</p>
            </div>

            <div className="space-y-4 max-w-md">
              <Input
                label="Organization Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />

              <div className="space-y-1.5 w-full">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                  Organization Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 focus:border-primary focus:ring-1 focus:ring-primary/10 rounded-lg p-3 text-sm"
                >
                  <option value="UTC">UTC (GMT+0)</option>
                  <option value="EST">EST (GMT-5)</option>
                  <option value="Asia/Kolkata">IST (GMT+5:30)</option>
                </select>
              </div>
            </div>

            <Button type="submit" className="text-xs py-2.5">
              Save Changes
            </Button>
          </form>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-headline font-bold text-xl mb-1">Team Members</h2>
                <p className="text-on-surface-variant text-xs">Manage active agents and roles in your workspace.</p>
              </div>
              <Button onClick={() => setOpenInviteModal(true)} className="gap-1.5 text-xs py-2">
                <Plus className="w-4 h-4" /> Invite Member
              </Button>
            </div>

            {/* List */}
            <div className="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-lowest divide-y divide-outline-variant/15">
              {members.map((m) => (
                <div key={m.id} className="p-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {m.firstName[0]}
                    </div>
                    <div>
                      <p className="font-bold">{m.firstName} {m.lastName}</p>
                      <p className="text-xs text-outline font-mono">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={m.role === 'OWNER' ? 'info' : 'neutral'}>{m.role}</Badge>
                    <Badge variant={m.isActive ? 'success' : 'error'}>
                      {m.isActive ? 'Active' : 'Suspended'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-headline font-bold text-xl mb-1">Plans & Billing</h2>
              <p className="text-on-surface-variant text-xs">Verify subscription metrics and limit usage charts.</p>
            </div>

            {/* Plan indicator */}
            <div className="border border-outline-variant/30 bg-surface-container-low/40 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <span className="text-[10px] font-mono text-outline uppercase tracking-wider block">Current Plan</span>
                <h3 className="font-headline font-bold text-2xl text-primary mt-1">{planLimits.name}</h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Your organization is subscribed to the Growth billing plan. Automatic renewals occur monthly.
                </p>
              </div>
              <div className="text-right">
                <Button className="text-xs py-2 bg-accent-gold hover:bg-accent-gold/90 text-inverse-surface">
                  Upgrade Plan
                </Button>
              </div>
            </div>

            {/* Usage Progress sliders */}
            <div className="space-y-6">
              <h4 className="font-headline font-bold text-sm uppercase tracking-wider font-mono text-outline">
                Billing Usage Caps
              </h4>

              {/* Progress 1 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Team Seats Used</span>
                  <span>{planLimits.seatsUsed} / {planLimits.seatsLimit}</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(planLimits.seatsUsed / planLimits.seatsLimit) * 100}%` }}
                    className="bg-primary h-full rounded-full"
                  ></div>
                </div>
              </div>

              {/* Progress 2 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">WhatsApp Phone Numbers</span>
                  <span>{planLimits.numbersUsed} / {planLimits.numbersLimit}</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(planLimits.numbersUsed / planLimits.numbersLimit) * 100}%` }}
                    className="bg-primary h-full rounded-full"
                  ></div>
                </div>
              </div>

              {/* Progress 3 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Monthly Message Quota</span>
                  <span>{planLimits.messagesUsed.toLocaleString()} / {planLimits.messagesLimit.toLocaleString()}</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(planLimits.messagesUsed / planLimits.messagesLimit) * 100}%` }}
                    className="bg-primary h-full rounded-full"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sso' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-headline font-bold text-xl mb-1">SSO / Access Control</h2>
              <p className="text-on-surface-variant text-xs">Configure OIDC enterprise single sign-on variables.</p>
            </div>

            {/* OIDC Config box */}
            <div className="border border-outline-variant/30 bg-surface-container-low/30 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-on-surface">OIDC SSO Status</h4>
                  <p className="text-xs text-on-surface-variant">Enterprise single sign-on is not configured.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/15">
                <Input label="Issuer URL" disabled placeholder="https://auth.company.com" />
                <Input label="Client ID" disabled placeholder="client_id_here" />
              </div>

              <Button disabled className="text-xs py-2">
                Configure Identity Provider
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'branding' && (
          <form onSubmit={handleSaveBranding} className="space-y-6">
            <div>
              <h2 className="font-headline font-bold text-xl mb-1">Branding & White-Label</h2>
              <p className="text-on-surface-variant text-xs">Configure custom domains, dashboard logos, and theme colors.</p>
            </div>

            <div className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <Input
                  label="Custom Whitelabel Domain"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="inbox.yourcompany.com"
                />
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-status-success" />
                  <span className="text-[10px] font-mono text-status-success font-bold">DNS Verified (CNAME pointing to proxy.aura.com)</span>
                </div>
              </div>

              <Input
                label="Dashboard Logo URL"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://company.com/logo.png"
              />

              <div className="space-y-1.5 w-full">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                  Primary Theme Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 border border-outline-variant/60 rounded cursor-pointer bg-transparent p-0"
                  />
                  <span className="font-mono text-xs font-semibold uppercase">{primaryColor}</span>
                </div>
              </div>
            </div>

            <Button type="submit" className="text-xs py-2.5">
              Save Branding Options
            </Button>
          </form>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-headline font-bold text-xl mb-1">Audit Log Viewer</h2>
                <p className="text-on-surface-variant text-xs">Review administrative actions and audit logs timeline.</p>
              </div>
              <Button variant="outline" className="gap-1.5 text-xs py-2">
                <FileDown className="w-4 h-4" /> Export CSV
              </Button>
            </div>

            {/* Audit Logs Table */}
            <div className="w-full">
              <Table columns={auditColumns} data={auditLogs} keyExtractor={(row) => row.id} />
            </div>
          </div>
        )}
      </div>

      {/* Team Invite Modal */}
      <Modal isOpen={openInviteModal} onClose={() => setOpenInviteModal(false)} title="Invite Team Member">
        <form onSubmit={handleInvite} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            required
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="agent@company.com"
          />

          <div className="space-y-1.5 w-full">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
              Access Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="w-full bg-surface-container-lowest border border-outline-variant/60 focus:border-primary focus:ring-1 focus:ring-primary/10 rounded-lg p-3 text-sm"
            >
              <option value="AGENT">Support Agent</option>
              <option value="OWNER">Administrator Owner</option>
            </select>
          </div>

          <Button type="submit" fullWidth>
            Send invitation
          </Button>
        </form>
      </Modal>
    </div>
  );
}
