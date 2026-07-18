import React from 'react';

interface VMInfrastructureDashboardProps {
  loading: boolean;
}

export default function VMInfrastructureDashboard({ loading }: VMInfrastructureDashboardProps) {
  const tiers = [
    {
      tier: 'Tier 1',
      allocated: 95,
      available: 25,
      specs: '2vCPU, 4GB RAM, 50GB Storage',
      price: '$100/mo',
      color: 'from-cyan-600 to-cyan-400',
    },
    {
      tier: 'Tier 2',
      allocated: 130,
      available: 30,
      specs: '4vCPU, 8GB RAM, 100GB Storage',
      price: '$150/mo',
      color: 'from-blue-600 to-blue-400',
    },
    {
      tier: 'Tier 3',
      allocated: 80,
      available: 15,
      specs: '8vCPU, 16GB RAM, 250GB Storage',
      price: '$200/mo',
      color: 'from-indigo-600 to-indigo-400',
    },
  ];

  const totalAllocated = tiers.reduce((sum, t) => sum + t.allocated, 0);
  const totalAvailable = tiers.reduce((sum, t) => sum + t.available, 0);
  const utilizationPercent = Math.round((totalAllocated / (totalAllocated + totalAvailable)) * 100);

  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 p-6 h-full hover:border-slate-600/50 transition">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🖥️</span> VM Infrastructure
        </h2>
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full">
          {utilizationPercent}% Utilized
        </span>
      </div>

      <div className="space-y-4">
        {tiers.map((tier, idx) => {
          const total = tier.allocated + tier.available;
          const percentage = Math.round((tier.allocated / total) * 100);

          return (
            <div
              key={idx}
              className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-white mb-1">{tier.tier}</p>
                  <p className="text-xs text-slate-400">{tier.specs}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-teal-400 text-lg">{tier.allocated}</p>
                  <p className="text-xs text-slate-400">allocated</p>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-600/50 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full bg-gradient-to-r ${tier.color} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{tier.available} available</span>
                <span className="text-amber-400 font-semibold">{tier.price}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-black text-white">{totalAllocated}</p>
            <p className="text-xs text-slate-400 mt-1">VMs Running</p>
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-400">{totalAvailable}</p>
            <p className="text-xs text-slate-400 mt-1">Available Capacity</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
        <p className="text-xs text-emerald-300">
          ✓ Data center: Cape Town • 99.9% SLA • Real-time monitoring
        </p>
      </div>
    </div>
  );
}
