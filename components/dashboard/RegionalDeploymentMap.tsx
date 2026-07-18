import React, { useMemo } from 'react';
import type { DashboardMetrics } from '@/types/dashboard';

interface RegionalDeploymentMapProps {
  metrics: DashboardMetrics;
  loading: boolean;
}

export default function RegionalDeploymentMap({ metrics, loading }: RegionalDeploymentMapProps) {
  const regions = useMemo(() => {
    return metrics.regionStats.map(region => ({
      ...region,
      agentPercentage: Math.round((region.agents / metrics.totalAgents) * 100),
      vmPercentage: Math.round((region.vms / metrics.activeVMs) * 100),
      revenuePercentage: Math.round((region.revenue / metrics.totalRevenue) * 100),
      status: region.agents > 0 ? 'operational' : 'planned',
    }));
  }, [metrics]);

  const totalAgents = metrics.totalAgents;
  const totalVMs = metrics.activeVMs;
  const totalRevenue = metrics.totalRevenue;

  // Simplified Regional Map Display (text-based, responsive)
  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 p-6 hover:border-slate-600/50 transition">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🌍</span> Regional Deployment Map
        </h2>
        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-semibold rounded-full">
          4 Active Regions
        </span>
      </div>

      {/* Regional Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {regions.map((region, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition"
          >
            {/* Region Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{region.region}</h3>
                <p className="text-xs text-slate-400">
                  {region.status === 'operational' ? '✓ Operational' : '⏳ Launching soon'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-teal-400">{region.agents}</p>
                <p className="text-xs text-slate-400">agents</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              {/* Agents Bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-slate-300">Agent Distribution</p>
                  <span className="text-xs text-teal-400">{region.agentPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-600/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${region.agentPercentage}%` }}
                  />
                </div>
              </div>

              {/* VMs Bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-slate-300">VM Allocation</p>
                  <span className="text-xs text-emerald-400">{region.vmPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-600/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${region.vmPercentage}%` }}
                  />
                </div>
              </div>

              {/* Revenue Bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-slate-300">Revenue Contribution</p>
                  <span className="text-xs text-amber-400">{region.revenuePercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-600/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${region.revenuePercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Region Stats Footer */}
            <div className="mt-4 pt-4 border-t border-slate-600/30 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm font-bold text-white">{region.vms}</p>
                <p className="text-xs text-slate-400">VMs</p>
              </div>
              <div>
                <p className="text-sm font-bold text-amber-400">${(region.revenue / 1000000).toFixed(2)}M</p>
                <p className="text-xs text-slate-400">Revenue</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Regional Expansion Timeline */}
      <div className="border-t border-slate-700/50 pt-6">
        <p className="text-xs font-semibold text-slate-300 mb-4 uppercase tracking-wide">Expansion Timeline</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-white">
              <span className="font-semibold">Rwanda:</span> <span className="text-slate-400">50 agents • Aug 1-5, 2026</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-white">
              <span className="font-semibold">Nigeria:</span> <span className="text-slate-400">85+ agents • Q3 2026</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-white">
              <span className="font-semibold">South Africa:</span> <span className="text-slate-400">120+ agents • Aug 6-15, 2026</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <p className="text-sm text-white">
              <span className="font-semibold">Global:</span> <span className="text-slate-400">50 agents • Q4 2026</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg">
        <p className="text-xs text-teal-300">
          ✓ Hub: Cape Town Data Center • Coordinated 09:00 CAT daily sync • 4 regional hubs operational
        </p>
      </div>
    </div>
  );
}
