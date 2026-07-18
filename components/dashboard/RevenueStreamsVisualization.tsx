import React, { useMemo } from 'react';
import type { DashboardMetrics } from '@/types/dashboard';

interface RevenueStreamsVisualizationProps {
  metrics: DashboardMetrics;
  loading: boolean;
}

export default function RevenueStreamsVisualization({ metrics, loading }: RevenueStreamsVisualizationProps) {
  const streams = useMemo(() => {
    const infrastructure = metrics.totalRevenue * 0.35;
    const partnerships = metrics.totalRevenue * 0.40;
    const consulting = metrics.totalRevenue * 0.25;

    return [
      {
        name: 'Infrastructure',
        percentage: 35,
        value: infrastructure,
        icon: '🖥️',
        color: 'from-emerald-600 to-emerald-400',
        description: 'VM hosting & data center',
      },
      {
        name: 'Partnerships',
        percentage: 40,
        value: partnerships,
        icon: '🤝',
        color: 'from-purple-600 to-purple-400',
        description: 'Commission & deals',
      },
      {
        name: 'Consulting',
        percentage: 25,
        value: consulting,
        icon: '💡',
        color: 'from-amber-600 to-amber-400',
        description: 'Training & services',
      },
    ];
  }, [metrics]);

  const monthlyProjection = metrics.totalRevenue / 12;
  const yearlyTarget = metrics.totalRevenue * 3.5;

  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 p-6 h-full hover:border-slate-600/50 transition">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>💰</span> Revenue Streams
        </h2>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full">
          2026 Target
        </span>
      </div>

      {/* Revenue Breakdown */}
      <div className="space-y-4 mb-6">
        {streams.map((stream, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{stream.icon}</span>
                <div>
                  <p className="font-semibold text-white text-sm">{stream.name}</p>
                  <p className="text-xs text-slate-400">{stream.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-teal-400 text-lg">{stream.percentage}%</p>
              </div>
            </div>

            <div className="w-full h-2 bg-slate-600/50 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${stream.color} rounded-full transition-all duration-500`}
                style={{ width: `${stream.percentage}%` }}
              />
            </div>

            <p className="text-xs text-slate-400 mt-2">
              ${(stream.value / 1000000).toFixed(2)}M annual
            </p>
          </div>
        ))}
      </div>

      {/* Projections */}
      <div className="border-t border-slate-700/50 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-xs text-slate-400 mb-1">Monthly Run Rate</p>
            <p className="text-xl font-black text-blue-400">
              ${(monthlyProjection / 1000000).toFixed(2)}M
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <p className="text-xs text-slate-400 mb-1">2027 Projection</p>
            <p className="text-xl font-black text-emerald-400">
              ${(yearlyTarget / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <p className="text-xs text-amber-300">
          ✓ Year 1 Target: $8M • Growth Rate: 45% MoM (Conservative: 25%)
        </p>
      </div>
    </div>
  );
}
