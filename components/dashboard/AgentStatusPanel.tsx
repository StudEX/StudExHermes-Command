import React, { useMemo } from 'react';
import type { DashboardMetrics } from '@/types/dashboard';

interface AgentStatusPanelProps {
  metrics: DashboardMetrics;
  loading: boolean;
}

export default function AgentStatusPanel({ metrics, loading }: AgentStatusPanelProps) {
  const agentBreakdown = useMemo(() => {
    if (!metrics.regionStats.length) return [];
    return metrics.regionStats.map(region => ({
      region: region.region,
      agents: region.agents,
      percentage: Math.round((region.agents / metrics.totalAgents) * 100),
      status: region.agents > 0 ? 'active' : 'idle',
      color: region.agents > 100 ? 'from-blue-600 to-blue-400' : 'from-cyan-600 to-cyan-400',
    }));
  }, [metrics]);

  const statusBadges = [
    { label: 'Active', count: 235, color: 'bg-green-500/20 text-green-300' },
    { label: 'Idle', count: 12, color: 'bg-yellow-500/20 text-yellow-300' },
    { label: 'Syncing', count: 3, color: 'bg-blue-500/20 text-blue-300' },
  ];

  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 p-6 h-full hover:border-slate-600/50 transition">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🤖</span> Agent Network Status
        </h2>
        <div className="flex gap-2">
          {statusBadges.map((badge, idx) => (
            <div
              key={idx}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}
            >
              {badge.label}: {badge.count}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {agentBreakdown.map((region, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-white">{region.region}</p>
                <p className="text-xs text-slate-400">{region.agents} agents deployed</p>
              </div>
              <span className="text-sm font-bold text-teal-400">{region.percentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${region.color} rounded-full transition-all duration-500`}
                style={{ width: `${region.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-black text-teal-400">100%</p>
            <p className="text-xs text-slate-400 mt-1">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-emerald-400">847</p>
            <p className="text-xs text-slate-400 mt-1">Daily Opportunities</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-amber-400">5.2d</p>
            <p className="text-xs text-slate-400 mt-1">Avg Deal Cycle</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-300">
          ✓ Next sync scheduled for 09:00 CAT • All agents responding
        </p>
      </div>
    </div>
  );
}
