import React from 'react';
import type { DashboardMetrics } from '@/types/dashboard';

interface MetricsHeaderProps {
  metrics: DashboardMetrics;
  loading: boolean;
}

export default function MetricsHeader({ metrics, loading }: MetricsHeaderProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const kpis = [
    {
      label: 'Total Agents',
      value: metrics.totalAgents,
      icon: '🤖',
      change: '+15%',
      color: 'from-blue-600 to-blue-400',
    },
    {
      label: 'Active VMs',
      value: metrics.activeVMs,
      icon: '🖥️',
      change: '+8%',
      color: 'from-emerald-600 to-emerald-400',
    },
    {
      label: 'Total Revenue',
      value: formatNumber(metrics.totalRevenue),
      icon: '💰',
      change: '+23%',
      color: 'from-amber-600 to-amber-400',
    },
    {
      label: 'Partnerships',
      value: metrics.partnershipsInPipeline,
      icon: '🤝',
      change: '+12%',
      color: 'from-purple-600 to-purple-400',
    },
  ];

  return (
    <header className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">AfricaBiz Ecosystem</h1>
          <p className="text-sm text-slate-400">
            Command Center • {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${kpi.color} p-0.5 transition-all hover:shadow-lg hover:shadow-slate-900/50`}
            >
              <div className="bg-slate-900 rounded-lg px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{kpi.icon}</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-green-500/20 text-green-300 rounded">
                    {kpi.change}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mb-1">{kpi.label}</p>
                <p className="text-xl sm:text-2xl font-black text-white">
                  {loading ? '—' : kpi.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
