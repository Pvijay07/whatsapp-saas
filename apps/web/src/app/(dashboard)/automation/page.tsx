'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, Plus, Search, Trash2, Edit3, Settings, Play, CheckCircle, ArrowDown } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';

interface Workflow {
  id: string;
  name: string;
  triggerType: 'MESSAGE_RECEIVED' | 'KEYWORD_MATCH' | 'TAG_ADDED' | 'STATUS_CHANGED';
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
  stepsCount: number;
  createdAt: string;
}

const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf_1',
    name: 'Auto-Welcome on First Contact',
    triggerType: 'MESSAGE_RECEIVED',
    status: 'ACTIVE',
    stepsCount: 3,
    createdAt: '2026-07-17T09:00:00Z',
  },
  {
    id: 'wf_2',
    name: 'Auto-Route Sales Tag queries',
    triggerType: 'KEYWORD_MATCH',
    status: 'DRAFT',
    stepsCount: 2,
    createdAt: '2026-07-19T10:00:00Z',
  },
];

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(MOCK_WORKFLOWS);
  const [search, setSearch] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  // Builder state
  const [workflowName, setWorkflowName] = useState('New Auto-Responder');
  const [triggerType, setTriggerType] = useState<string>('KEYWORD_MATCH');
  const [triggerConfig, setTriggerConfig] = useState({ keyword: 'pricing' });
  const [steps, setSteps] = useState<any[]>([
    { id: 'step_1', type: 'action', action: 'send_template', config: { templateName: 'welcome_message' } },
    { id: 'step_2', type: 'action', action: 'add_tag', config: { tagName: 'Sales Lead' } },
  ]);

  const activeWorkflow = workflows.find((w) => w.id === selectedWorkflow);

  const handleAddStep = () => {
    const nextId = `step_${Date.now()}`;
    setSteps([...steps, { id: nextId, type: 'action', action: 'send_template', config: { templateName: 'welcome_message' } }]);
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const handleUpdateStepAction = (id: string, action: string) => {
    setSteps(
      steps.map((s) => (s.id === id ? { ...s, action, config: getStepDefaultConfig(action) } : s)),
    );
  };

  const handleUpdateStepConfig = (id: string, key: string, value: string) => {
    setSteps(
      steps.map((s) => (s.id === id ? { ...s, config: { ...s.config, [key]: value } } : s)),
    );
  };

  const getStepDefaultConfig = (action: string) => {
    if (action === 'send_template') return { templateName: 'welcome_message' };
    if (action === 'add_tag') return { tagName: 'VIP Customer' };
    if (action === 'assign_agent') return { agentId: 'u_1' };
    return {};
  };

  const handleSaveWorkflow = () => {
    const newWf: Workflow = {
      id: selectedWorkflow || `wf_${Date.now()}`,
      name: workflowName,
      triggerType: triggerType as any,
      status: activeWorkflow?.status || 'DRAFT',
      stepsCount: steps.length,
      createdAt: activeWorkflow?.createdAt || new Date().toISOString(),
    };

    if (selectedWorkflow) {
      setWorkflows(workflows.map((w) => (w.id === selectedWorkflow ? newWf : w)));
    } else {
      setWorkflows([...workflows, newWf]);
    }
    setSelectedWorkflow(null);
  };

  const handleStartBuilder = (wf?: Workflow) => {
    if (wf) {
      setSelectedWorkflow(wf.id);
      setWorkflowName(wf.name);
      setTriggerType(wf.triggerType);
      // Mock steps for edit
      setSteps([
        { id: 'step_1', type: 'action', action: 'send_template', config: { templateName: 'welcome_message' } },
        { id: 'step_2', type: 'action', action: 'add_tag', config: { tagName: 'Sales Lead' } },
      ]);
    } else {
      setSelectedWorkflow('new');
      setWorkflowName('New Auto-Responder');
      setTriggerType('KEYWORD_MATCH');
      setTriggerConfig({ keyword: 'pricing' });
      setSteps([
        { id: 'step_1', type: 'action', action: 'send_template', config: { templateName: 'welcome_message' } },
      ]);
    }
  };

  const handleToggleStatus = (id: string) => {
    setWorkflows(
      workflows.map((w) => {
        if (w.id === id) {
          const nextStatus = w.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          return { ...w, status: nextStatus };
        }
        return w;
      }),
    );
  };

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter((w) => w.id !== id));
  };

  const filtered = workflows.filter((w) => w.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* Sidebar List */}
      {!selectedWorkflow ? (
        <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 shrink-0">
            <div>
              <h1 className="font-headline font-bold text-2xl text-on-surface">Workflows Automation</h1>
              <p className="text-on-surface-variant text-xs mt-0.5">
                Build no-code linear response pathways triggered by incoming message keywords.
              </p>
            </div>

            <Button onClick={() => handleStartBuilder()} className="gap-2 text-xs py-2.5">
              <Plus className="w-4 h-4" /> Create Workflow
            </Button>
          </div>

          {/* Filter search */}
          <div className="relative max-w-sm shrink-0">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search workflows..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((wf) => (
              <div
                key={wf.id}
                className="glass-card bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-headline font-bold text-base text-on-surface">{wf.name}</h3>
                    <Badge variant={wf.status === 'ACTIVE' ? 'success' : 'neutral'}>
                      {wf.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-xs text-on-surface-variant font-mono">
                    <p>Trigger: {wf.triggerType}</p>
                    <p>Steps count: {wf.stepsCount} nodes</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-6 mt-6 border-t border-outline-variant/10 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(wf.id)}
                    className="text-[11px]"
                  >
                    {wf.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartBuilder(wf)}
                    className="text-[11px]"
                  >
                    Edit
                  </Button>
                  <button
                    onClick={() => handleDeleteWorkflow(wf.id)}
                    className="text-error hover:bg-error/5 p-2 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Workflow Builder Canvas Screen
        <div className="flex-1 flex flex-col h-full bg-surface-container-low/20">
          {/* Top Bar */}
          <div className="h-16 bg-surface-container-lowest border-b border-outline-variant/60 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="font-headline font-bold text-lg bg-transparent border-b border-transparent hover:border-outline-variant/60 focus:border-primary focus:outline-none py-1"
              />
              <span className="text-outline">/</span>
              <span className="text-xs text-outline-variant font-mono">Builder Mode</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedWorkflow(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveWorkflow}>
                Save Workflow
              </Button>
            </div>
          </div>

          {/* Builder Canvas Area */}
          <div className="flex-grow overflow-y-auto p-8 flex flex-col items-center select-none bg-[radial-gradient(#bccac4_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Step Card: Trigger */}
            <div className="w-[380px] bg-surface-container-lowest border-2 border-primary rounded-xl p-5 shadow-sm space-y-4 relative flex flex-col items-stretch text-left">
              <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2">
                <span className="font-mono text-[9px] font-bold text-primary uppercase tracking-wider">
                  Node 1: Trigger
                </span>
                <Badge variant="info">INBOUND</Badge>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5 w-full">
                  <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                    Trigger Event
                  </label>
                  <select
                    value={triggerType}
                    onChange={(e) => setTriggerType(e.target.value)}
                    className="w-full bg-background border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary/10 rounded-lg p-2.5 text-xs font-semibold"
                  >
                    <option value="KEYWORD_MATCH">Keyword Equals</option>
                    <option value="MESSAGE_RECEIVED">Every Incoming Message</option>
                    <option value="TAG_ADDED">Contact Tagged</option>
                  </select>
                </div>

                {triggerType === 'KEYWORD_MATCH' && (
                  <Input
                    label="Keyword Match (Lowercase)"
                    value={triggerConfig.keyword}
                    onChange={(e) => setTriggerConfig({ ...triggerConfig, keyword: e.target.value })}
                  />
                )}
              </div>
            </div>

            {/* Connecting Line */}
            <div className="flex justify-center py-4">
              <div className="w-0.5 h-8 bg-outline-variant/60 relative">
                <ArrowDown className="w-4 h-4 text-outline-variant absolute bottom-[-8px] left-[-7px]" />
              </div>
            </div>

            {/* Steps Loop */}
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Node Action Card */}
                <div className="w-[380px] bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 shadow-sm space-y-4 relative flex flex-col items-stretch text-left hover:border-primary/60 transition-colors">
                  <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2">
                    <span className="font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Node {index + 2}: Action
                    </span>
                    <button
                      onClick={() => handleRemoveStep(step.id)}
                      className="text-on-surface-variant hover:text-error rounded p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5 w-full">
                      <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider font-mono">
                        Action Type
                      </label>
                      <select
                        value={step.action}
                        onChange={(e) => handleUpdateStepAction(step.id, e.target.value)}
                        className="w-full bg-background border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary/10 rounded-lg p-2.5 text-xs font-semibold"
                      >
                        <option value="send_template">Send Message Template</option>
                        <option value="add_tag">Add Tag to Contact</option>
                        <option value="assign_agent">Assign to Agent</option>
                      </select>
                    </div>

                    {step.action === 'send_template' && (
                      <Input
                        label="Template Name"
                        value={step.config.templateName}
                        onChange={(e) => handleUpdateStepConfig(step.id, 'templateName', e.target.value)}
                      />
                    )}

                    {step.action === 'add_tag' && (
                      <Input
                        label="Tag Name"
                        value={step.config.tagName}
                        onChange={(e) => handleUpdateStepConfig(step.id, 'tagName', e.target.value)}
                      />
                    )}

                    {step.action === 'assign_agent' && (
                      <Input
                        label="Agent User ID"
                        value={step.config.agentId}
                        onChange={(e) => handleUpdateStepConfig(step.id, 'agentId', e.target.value)}
                      />
                    )}
                  </div>
                </div>

                {/* Connecting Line */}
                <div className="flex justify-center py-4">
                  <div className="w-0.5 h-8 bg-outline-variant/60 relative">
                    <ArrowDown className="w-4 h-4 text-outline-variant absolute bottom-[-8px] left-[-7px]" />
                  </div>
                </div>
              </React.Fragment>
            ))}

            {/* Add Node Button */}
            <button
              onClick={handleAddStep}
              className="w-[380px] border border-dashed border-outline hover:border-primary hover:text-primary rounded-xl p-4 flex items-center justify-center gap-2 text-xs font-semibold text-on-surface-variant transition-colors bg-surface-container-lowest/40 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Action Node
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
