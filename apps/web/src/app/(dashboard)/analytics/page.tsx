'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, ArrowUpRight, ShieldAlert, Download, Calendar } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Button from '../../../components/ui/Button';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface AnalyticsOverview {
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  deliveredRate: number;
  readRate: number;
  failedRate: number;
}

export default function AnalyticsPage() {
  const [days, setDays] = useState(7);
  const [overview, setOverview] = useState<AnalyticsOverview>({
    sent: 12847,
    delivered: 12651,
    read: 9103,
    failed: 196,
    deliveredRate: 98.5,
    readRate: 71.9,
    failedRate: 1.5,
  });

  const [dailyData, setDailyData] = useState([
    { date: 'Mon', sent: 1200, read: 800 },
    { date: 'Tue', sent: 1500, read: 1100 },
    { date: 'Wed', sent: 1800, read: 1400 },
    { date: 'Thu', sent: 1400, read: 950 },
    { date: 'Fri', sent: 2100, read: 1700 },
    { date: 'Sat', sent: 900, read: 600 },
    { date: 'Sun', sent: 1100, read: 850 },
  ]);

  const [agentPerformance, setAgentPerformance] = useState([
    { name: 'John Doe', conversations: 142, responseTime: '4m 12s', rate: 94 },
    { name: 'Jane Smith', conversations: 189, responseTime: '3m 45s', rate: 97 },
    { name: 'David Chen', conversations: 88, responseTime: '8m 30s', rate: 89 },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Load actual overview data
    fetch(`http://localhost:3001/api/analytics/overview?days=${days}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) setOverview(data);
      })
      .catch(() => {});

    // Load actual daily data
    fetch(`http://localhost:3001/api/analytics/daily?days=${days}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDailyData(data.map((d: any) => ({
            date: d.date.split('-').slice(1).join('/'),
            sent: d.sent,
            read: d.read || Math.round(d.delivered * 0.7),
          })));
        }
      })
      .catch(() => {});

    // Load agent performance
    fetch('http://localhost:3001/api/analytics/agents', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAgentPerformance(data.map((d: any) => ({
            name: d.agentName,
            conversations: d.conversationsHandled,
            responseTime: `${Math.round(d.avgResponseTimeMs / 60000)}m ${Math.round((d.avgResponseTimeMs % 60000) / 1000)}s`,
            rate: Math.round(d.resolutionRate),
          })));
        }
      })
      .catch(() => {});
  }, [days]);

  // Chart data setup
  const chartData = {
    labels: dailyData.map((d) => d.date),
    datasets: [
      {
        label: 'Messages Sent',
        data: dailyData.map((d) => d.sent),
        borderColor: '#05a68b', // primary.container
        backgroundColor: 'rgba(5, 166, 139, 0.05)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Messages Read',
        data: dailyData.map((d) => d.read),
        borderColor: '#FAB534', // accent-gold
        backgroundColor: 'rgba(250, 181, 52, 0.03)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { family: 'Inter', size: 11 },
        },
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.03)' },
        ticks: { font: { family: 'JetBrains Mono', size: 9 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'JetBrains Mono', size: 9 } },
      },
    },
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 shrink-0">
        <div>
          <h1 className="font-headline font-bold text-2xl text-on-surface">Analytics Overview</h1>
          <p className="text-on-surface-variant text-xs mt-0.5">
            Monitor WABA traffic delivery, read ratios, and agent response indicators.
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="bg-surface-container border border-outline-variant/60 focus:border-primary focus:ring-1 focus:ring-primary/10 rounded-lg p-2 text-xs font-semibold text-on-surface"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
          <Button variant="outline" className="gap-1.5 text-xs py-2">
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 shrink-0">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Messages Sent</span>
          <div className="flex justify-between items-end relative z-10">
            <h3 className="font-headline font-black text-3xl text-slate-800 tracking-tight">{overview.sent}</h3>
            <span className="bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Delivered Rate</span>
          <div className="flex justify-between items-end relative z-10">
            <h3 className="font-headline font-black text-3xl text-slate-800 tracking-tight">
              {overview.deliveredRate.toFixed(1)}%
            </h3>
            <span className="bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +0.4%
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Read Rate</span>
          <div className="flex justify-between items-end relative z-10">
            <h3 className="font-headline font-black text-3xl text-slate-800 tracking-tight">
              {overview.readRate.toFixed(1)}%
            </h3>
            <span className="bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +5.2%
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Failed Rate</span>
          <div className="flex justify-between items-end relative z-10">
            <h3 className="font-headline font-black text-3xl text-slate-800 tracking-tight">
              {overview.failedRate.toFixed(1)}%
            </h3>
            <span className="bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> -0.8%
            </span>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-7 flex flex-col justify-between min-h-[400px]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline font-black text-lg text-slate-800 tracking-tight">
            Message Volume Flow
          </h3>
          <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold">
            Real-time Activity
          </span>
        </div>
        <div className="flex-1 min-h-[280px] relative">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Agent Performance Grid */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-7 space-y-6">
        <h3 className="font-headline font-black text-lg text-slate-800 tracking-tight">
          Agent Response Metrics
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                <th className="pb-4 text-left">Agent Name</th>
                <th className="pb-4 text-center">Conversations Handled</th>
                <th className="pb-4 text-center">Avg Response Time</th>
                <th className="pb-4 text-center">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agentPerformance.map((agent, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {agent.name.charAt(0)}
                    </div>
                    {agent.name}
                  </td>
                  <td className="py-4 text-center text-slate-600 font-mono font-medium">{agent.conversations}</td>
                  <td className="py-4 text-center text-slate-600 font-mono font-medium">{agent.responseTime}</td>
                  <td className="py-4 text-center">
                    <span className="inline-flex items-center justify-center bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full font-bold font-mono text-xs">
                      {agent.rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
