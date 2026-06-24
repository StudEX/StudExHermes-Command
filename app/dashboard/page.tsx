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

type GuardLimits = {
  dailyCapUsd: number
  dailySpentUsd: number
  dailyRemainingUsd: number
  agentMinuteCalls: number
  maxRecursion: number
  toolAllowlist: string[] | '*'
  panicStopped: boolean
  perAgentCalls: Record<string, number>
}

const READINESS_STYLE: Record<Readiness, { label: string; cls: string }> = {
  operational: { label: 'OPERATIONAL', cls: 'bg-[#556b2f] text-white' },
  degraded: { label: 'NEEDS KEYS', cls: 'bg-[#ff6b00] text-white' },
  external: { label: 'EXTERNAL', cls: 'bg-[#1a1a1a] text-[#ffff00]' },
  planned: { label: 'PLANNED', cls: 'bg-gray-200 text-gray-500' },
};

export default function DashboardPage() {
  const [status, setStatus] = useState<FleetStatus | null>(null);
  const [limits, setLimits] = useState<GuardLimits | null>(null);
  const [brainQ, setBrainQ] = useState('');
  const [brainAnswer, setBrainAnswer] = useState<string | null>(null);
  const [brainLoading, setBrainLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/status').then(r => r.json()).catch(() => null),
      fetch('/api/guard/limits').then(r => r.json()).catch(() => null),
    ])
      .then(([s, g]) => {
        setStatus(s?.capabilities ?? null);
        setLimits(g?.limits ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  const capabilities = Object.keys(CAPABILITY_LABELS) as Capability[];

  async function runBrain() {
    if (!brainQ.trim()) return;
    setBrainLoading(true);
    setBrainAnswer(null);
    try {
      const res = await fetch('/api/brain/query', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ q: brainQ.trim() }),
      });
      const data = await res.json();
      const cites = (data.citations ?? []).map((c: { title: string; source: string; score: number }) =>
        `· ${c.title} [${c.source} ${c.score.toFixed(2)}]`).join('\n');
      const gaps = (data.gaps ?? []).map((g: string) => `! ${g}`).join('\n');
      setBrainAnswer([data.answer, cites, gaps].filter(Boolean).join('\n\n') + `\n\n[backend: ${data.backend}]`);
    } catch (e) {
      setBrainAnswer(`error: ${(e as Error).message}`);
    } finally {
      setBrainLoading(false);
    }
  }

  async function panic() {
    if (!confirm('Panic-stop the fleet? All guarded calls will refuse until process restart.')) return;
    const res = await fetch('/api/guard/limits', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'panic' }),
    });
    const data = await res.json();
    setLimits(data.limits ?? null);
  }

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
              Agent Fleet · All Businesses · GBrain · CashClaw Guard
            </p>
          </div>
        </div>
        <div className="text-right flex gap-2 items-center">
          <div className="inline-block px-3 py-1 bg-[#1a1a1a] text-[#ffff00] text-[10px] font-bold">
            {loading ? 'CHECKING…' : `${FLEET.length} AGENTS`}
          </div>
          <button
            onClick={panic}
            className="px-3 py-1 bg-red-700 text-white text-[10px] font-black hover:bg-red-900"
            title="Stop all guarded calls"
          >
            PANIC STOP
          </button>
        </div>
      </header>

      {/* Guard panel */}
      <section className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border-2 border-[#1a1a1a] bg-[#1a1a1a] text-white p-4">
          <p className="text-[10px] tracking-widest text-orange-300">DAILY CAP</p>
          <p className="text-2xl font-black mt-1">${limits?.dailyCapUsd?.toFixed(2) ?? '—'}</p>
          <p className="text-[10px] text-gray-400 mt-1">
            spent ${limits?.dailySpentUsd?.toFixed(4) ?? '—'} · left ${limits?.dailyRemainingUsd?.toFixed(4) ?? '—'}
          </p>
        </div>
        <div className="border-2 border-[#1a1a1a] p-4 bg-white">
          <p className="text-[10px] tracking-widest text-gray-500">RATE LIMIT</p>
          <p className="text-2xl font-black mt-1">{limits?.agentMinuteCalls ?? '—'}/min</p>
          <p className="text-[10px] text-gray-400 mt-1">per agent</p>
        </div>
        <div className="border-2 border-[#1a1a1a] p-4 bg-white">
          <p className="text-[10px] tracking-widest text-gray-500">MAX RECURSION</p>
          <p className="text-2xl font-black mt-1">{limits?.maxRecursion ?? '—'}</p>
          <p className="text-[10px] text-gray-400 mt-1">guard.run depth</p>
        </div>
        <div className={`border-2 p-4 ${limits?.panicStopped ? 'border-red-700 bg-red-50' : 'border-[#556b2f] bg-white'}`}>
          <p className="text-[10px] tracking-widest text-gray-500">PANIC</p>
          <p className={`text-2xl font-black mt-1 ${limits?.panicStopped ? 'text-red-700' : 'text-[#556b2f]'}`}>
            {limits?.panicStopped ? 'STOPPED' : 'CLEAR'}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            tools: {limits?.toolAllowlist === '*' ? 'all' : `${(limits?.toolAllowlist as string[] | undefined)?.length ?? 0} listed`}
          </p>
        </div>
      </section>

      {/* Capability strip */}
      <section className="mb-10">
        <h2 className="text-xs font-black uppercase tracking-widest mb-4 border-l-4 border-[#ff6b00] pl-3">
          Integration Readiness
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
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

      {/* Brain query box */}
      <section className="mb-10 border-2 border-[#1a1a1a] bg-white p-6">
        <h2 className="text-xs font-black uppercase tracking-widest mb-4 border-l-4 border-[#ff6b00] pl-3">
          Second Brain Query
        </h2>
        <div className="flex gap-2 mb-3">
          <input
            value={brainQ}
            onChange={e => setBrainQ(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') runBrain() }}
            placeholder="ask the brain — e.g. what wagyu grade did Sandton order?"
            className="flex-1 border-2 border-gray-200 p-3 text-[11px] focus:border-[#ff6b00] outline-none"
          />
          <button
            onClick={runBrain}
            disabled={brainLoading}
            className="px-6 bg-[#1a1a1a] text-white text-[10px] font-black hover:bg-[#ff6b00] disabled:opacity-50"
          >
            {brainLoading ? 'THINKING…' : 'QUERY'}
          </button>
        </div>
        {brainAnswer && (
          <pre className="text-[11px] bg-gray-50 p-4 border border-gray-200 whitespace-pre-wrap font-mono">{brainAnswer}</pre>
        )}
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
                    {agent.skills && agent.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {agent.skills.map(sk => (
                          <span key={sk} className="px-2 py-0.5 text-[9px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                    {readiness === 'degraded' && missing.length > 0 && (
                      <p className="text-[9px] text-[#ff6b00] font-bold">
                        Needs: {missing.map(m => CAPABILITY_LABELS[m]).join(', ')}
                      </p>
                    )}
                    {readiness === 'external' && (
                      <p className="text-[9px] text-gray-400 font-bold">Runs in external console</p>
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

      <nav className="fixed bottom-8 right-8 flex gap-4 z-50">
        <a href="/" className="bg-white border border-gray-200 px-4 py-2 text-[10px] font-black hover:border-[#ff6b00] hover:text-[#ff6b00] shadow-xl">HERMES CMD</a>
        <a href="/memory" className="bg-white border border-gray-200 px-4 py-2 text-[10px] font-black hover:border-[#ff6b00] hover:text-[#ff6b00] shadow-xl">MEMORY</a>
        <a href="/horizon" className="bg-[#1a1a1a] text-white px-4 py-2 text-[10px] font-black hover:bg-[#ff6b00] shadow-xl">HORIZON</a>
      </nav>
    </main>
  );
}
