import React from 'react';

interface PartnershipPipelineTrackerProps {
  loading: boolean;
}

export default function PartnershipPipelineTracker({ loading }: PartnershipPipelineTrackerProps) {
  const stages = [
    {
      name: 'Prospecting',
      count: 38,
      deals: 450000,
      color: 'from-slate-600 to-slate-400',
    },
    {
      name: 'Negotiating',
      count: 42,
      deals: 850000,
      color: 'from-yellow-600 to-yellow-400',
    },
    {
      name: 'Closing',
      count: 28,
      deals: 650000,
      color: 'from-blue-600 to-blue-400',
    },
    {
      name: 'Closed',
      count: 37,
      deals: 1250000,
      color: 'from-green-600 to-green-400',
    },
  ];

  const totalDeals = stages.reduce((sum, s) => sum + s.deals, 0);
  const totalCount = stages.reduce((sum, s) => sum + s.count, 0);

  const recentDeals = [
    { name: 'NTechLab Expansion', value: '$500K', stage: 'Closing', daysInStage: 12 },
    { name: 'Art-Engineer Integration', value: '$350K', stage: 'Negotiating', daysInStage: 8 },
    { name: 'PharmaSyntez Partnership', value: '$400K', stage: 'Closing', daysInStage: 5 },
    { name: 'GlobalMarkets Alliance', value: '$250K', stage: 'Prospecting', daysInStage: 3 },
  ];

  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 p-6 h-full hover:border-slate-600/50 transition">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🤝</span> Partnership Pipeline
        </h2>
        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full">
          {totalCount} Active Deals
        </span>
      </div>

      {/* Pipeline Funnel */}
      <div className="space-y-3 mb-6">
        {stages.map((stage, idx) => {
          const percentage = Math.round((stage.deals / totalDeals) * 100);
          return (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-white">{stage.name}</p>
                <div className="text-right">
                  <p className="text-sm font-bold text-teal-400">${(stage.deals / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-slate-400">{stage.count} deals</p>
                </div>
              </div>
              <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${stage.color} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Deals */}
      <div className="border-t border-slate-700/50 pt-4">
        <p className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wide">Hot Opportunities</p>
        <div className="space-y-2">
          {recentDeals.map((deal, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-slate-700/20 rounded border border-slate-600/20"
            >
              <div>
                <p className="text-xs font-semibold text-white">{deal.name}</p>
                <p className="text-xs text-slate-400">{deal.daysInStage} days in {deal.stage}</p>
              </div>
              <span className="font-bold text-emerald-400">{deal.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total Pipeline Value */}
      <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <p className="text-xs text-purple-300">
          ✓ Total Pipeline: ${(totalDeals / 1000000).toFixed(1)}M • 5.2 day avg cycle
        </p>
      </div>
    </div>
  );
}
