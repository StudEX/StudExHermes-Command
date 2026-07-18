'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AgentStatusPanel from '@/components/dashboard/AgentStatusPanel';
import VMInfrastructureDashboard from '@/components/dashboard/VMInfrastructureDashboard';
import PartnershipPipelineTracker from '@/components/dashboard/PartnershipPipelineTracker';
import RevenueStreamsVisualization from '@/components/dashboard/RevenueStreamsVisualization';
import RegionalDeploymentMap from '@/components/dashboard/RegionalDeploymentMap';
import MetricsHeader from '@/components/dashboard/MetricsHeader';
import type { DashboardMetrics, RegionalStats } from '@/types/dashboard';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAgents: 0,
    activeVMs: 0,
    totalRevenue: 0,
    partnershipsInPipeline: 0,
    regionStats: [],
    lastUpdated: new Date(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && isLoggedIn) {
      initializeDashboard();
    }
  }, [isLoggedIn]);

  const initializeDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        setMetrics(getDefaultMetrics());
      }
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
      setMetrics(getDefaultMetrics());
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center font-sans">
        <div className="bg-slate-700/30 backdrop-blur-md border border-slate-600/50 rounded-lg p-12 shadow-2xl w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center rounded-lg shadow-lg">
              <span className="text-white font-black text-2xl">AB</span>
            </div>
          </div>
          <h1 className="text-2xl font-black mb-2 text-center text-white tracking-tight">AfricaBiz</h1>
          <p className="text-center text-slate-300 text-sm mb-8">Ecosystem Command Center</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Access Key"
              className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all transform active:scale-95"
            >
              ENTER DASHBOARD
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans">
      <MetricsHeader metrics={metrics} loading={loading} />

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Top Row: Agent Status & VM Infrastructure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AgentStatusPanel metrics={metrics} loading={loading} />
          <VMInfrastructureDashboard loading={loading} />
        </div>

        {/* Middle Row: Partnership Pipeline & Revenue Streams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PartnershipPipelineTracker loading={loading} />
          <RevenueStreamsVisualization metrics={metrics} loading={loading} />
        </div>

        {/* Bottom Row: Regional Deployment Map */}
        <div className="mb-6">
          <RegionalDeploymentMap metrics={metrics} loading={loading} />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-700/50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
            <div>
              <p className="font-semibold text-slate-300 mb-1">Daily Orchestration</p>
              <p>09:00 CAT - Agent Network Sync</p>
            </div>
            <div>
              <p className="font-semibold text-slate-300 mb-1">Obsidian Brain</p>
              <p>Real-time Intelligence Aggregation</p>
            </div>
            <div>
              <p className="font-semibold text-slate-300 mb-1">Status</p>
              <p className="text-teal-400">✓ All Systems Operational</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function getDefaultMetrics(): DashboardMetrics {
  return {
    totalAgents: 250,
    activeVMs: 305,
    totalRevenue: 2400000,
    partnershipsInPipeline: 145,
    regionStats: [
      { region: 'Rwanda', agents: 50, vms: 50, revenue: 150000 },
      { region: 'Nigeria', agents: 85, vms: 100, revenue: 350000 },
      { region: 'South Africa', agents: 120, vms: 155, revenue: 1800000 },
      { region: 'Global', agents: 50, vms: 0, revenue: 100000 },
    ],
    lastUpdated: new Date(),
  };
}
