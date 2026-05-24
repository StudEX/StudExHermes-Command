'use client';

import React, { useEffect, useState } from 'react';
import {
  BUSINESSES,
  CAPABILITY_LABELS,
  FLEET,
  agentReadiness,
  missingCapabilities,
  type Capability,
  type FleetStatus,
  type Readiness,
} from '@/lib/fleet';

const READINESS_STYLE: Record<Readiness, { label: string; cls: string }> = {
  operational: { label: 'OPERATIONAL', cls: 'bg-[#556b2f] text-white' },
  degraded: { label: 'NEEDS KEYS', cls: 'bg-[#ff6b00] text-white' },
  external: { label: 'EXTERNAL', cls: 'bg-[#1a1a1a] text-[#ffff00]' },
  planned: { label: 'PLANNED', cls: 'bg-gray-200 text-gray-500' },
};

export default function DashboardPage() {
  const [status, setStatus] = useState<FleetStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/status')
      .then(r => r.json())
      .then(d => setStatus(d?.capabilities ?? null))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, []);

  const capabilities = Object.keys(CAPABILITY_LABELS) as Capability[];

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#1a1a1a] p-8 font-mono">
      <header className="mb-10 border-b-2 border-[#ff6b00] pb-6 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#1a1a1a] flex items-center justify-center border-2 border-[#ff6b00]">
            <span className="text-[#ffff00] font-black text-xl italic">SX</span>
          </div>
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              SUPPORT <span className="text-[#ff6b00]">COMMAND</span>
            </h1>
            <p className="text-[10px] text-orange-600 font-bold tracking-widest uppercase mt-1">
              Agent Fleet · All Businesses
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-block px-3 py-1 bg-[#1a1a1a] text-[#ffff00] text-[10px] font-bold">
            {loading ? 'CHECKING…' : `${FLEET.length} AGENTS`}
          </div>
        </div>
      </header>

      {/* Capability strip */}
      <section className="mb-10">
        <h2 className="text-xs font-black uppercase tracking-widest mb-4 border-l-4 border-[#ff6b00] pl-3">
          Integration Readiness
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {capabilities.map(cap => {
            const on = status?.[cap] ?? false;
            return (
              <div
                key={cap}
                className={`p-3 border-2 ${on ? 'border-[#556b2f] bg-[#556b2f]/5' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`w-2 h-2 rounded-full ${on ? 'bg-[#556b2f]' : 'bg-gray-300'}`} />
                  <span className={`text-[9px] font-black ${on ? 'text-[#556b2f]' : 'text-gray-400'}`}>
                    {on ? 'READY' : 'OFF'}
                  </span>
                </div>
                <p className="text-[10px] font-bold leading-tight">{CAPABILITY_LABELS[cap]}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Agents grouped by business */}
      {BUSINESSES.map(biz => {
        const agents = FLEET.filter(a => a.businesses.includes(biz.id));
        if (agents.length === 0) return null;
        return (
          <section key={biz.id} className="mb-10">
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-lg font-black uppercase tracking-tight">{biz.name}</h2>
              <span className="text-[10px] text-gray-400 italic">{biz.blurb}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {agents.map(agent => {
                const readiness = agentReadiness(agent, status);
                const missing = missingCapabilities(agent, status);
                const style = READINESS_STYLE[readiness];
                const card = (
                  <div className="bg-white border-2 border-[#1a1a1a] p-5 h-full hover:shadow-[6px_6px_0px_#ff6b00] transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-base font-black uppercase">{agent.name}</h3>
                      <span className={`px-2 py-0.5 text-[9px] font-black ${style.cls}`}>
                        {style.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mb-4 leading-snug">{agent.tagline}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {agent.channels.map(ch => (
                        <span key={ch} className="px-2 py-0.5 text-[9px] font-bold bg-gray-100 text-gray-600">
                          {ch}
                        </span>
                      ))}
                    </div>
                    {readiness === 'degraded' && missing.length > 0 && (
                      <p className="text-[9px] text-[#ff6b00] font-bold">
                        Needs: {missing.map(m => CAPABILITY_LABELS[m]).join(', ')}
                      </p>
                    )}
                    {readiness === 'external' && (
                      <p className="text-[9px] text-gray-400 font-bold">Runs in ElevenLabs console</p>
                    )}
                    {readiness === 'planned' && (
                      <p className="text-[9px] text-gray-400 font-bold">Separate service — not deployed</p>
                    )}
                  </div>
                );
                return agent.href ? (
                  <a key={agent.id} href={agent.href} className="block">
                    {card}
                  </a>
                ) : (
                  <div key={agent.id}>{card}</div>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
