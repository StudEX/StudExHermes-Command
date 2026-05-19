'use client';

import React, { useEffect, useRef, useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  source?: 'cloud' | 'fallback';
};

const QUICK_PROMPTS = [
  'Recommend a Wagyu cut for two',
  "I'm hosting a braai for 8 on Saturday",
  'Corporate gift for 12 clients',
  "What's your premium tier?",
];

export default function SalesAgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Welcome to StudEx. I'm ADA — your sales concierge. Tell me the occasion, headcount, and budget and I'll lock in the right cut.",
      source: 'fallback',
    },
  ]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, pending]);

  async function send(text: string) {
    const userMsg: Message = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setPending(true);
    try {
      const res = await fetch('/api/sales/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data?.content ?? 'Connection to the butcher dropped. Try again.',
          source: data?.source,
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Network error. Please retry.', source: 'fallback' },
      ]);
    } finally {
      setPending(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || pending) return;
    send(trimmed);
  }

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#1a1a1a] p-8 font-mono">
      <header className="mb-10 border-b-2 border-[#ff6b00] pb-6 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#1a1a1a] flex items-center justify-center border-2 border-[#ff6b00]">
            <span className="text-[#ffff00] font-black text-xl italic">SX</span>
          </div>
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              ADA <span className="text-[#ff6b00]">SALES AGENT</span>
            </h1>
            <p className="text-[10px] text-orange-600 font-bold tracking-widest uppercase mt-1">
              Customer Conversion Console — pattern inspired by ada_v2
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-block px-3 py-1 bg-[#1a1a1a] text-[#ffff00] text-[10px] font-bold">
            CHANNEL: WEB · LIVE
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-8">
          <div className="bg-white border-4 border-[#1a1a1a] shadow-[10px_10px_0px_#ff6b00] flex flex-col h-[72vh]">
            <div className="px-6 py-4 border-b-2 border-[#1a1a1a] flex justify-between items-center">
              <h2 className="text-xs font-black uppercase tracking-widest">Live Conversation</h2>
              <span className="text-[10px] text-gray-500">studex-meat · ZAR</span>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 text-sm leading-relaxed border-2 ${
                      m.role === 'user'
                        ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                        : 'bg-[#fffaf3] text-[#1a1a1a] border-[#ff6b00]/40'
                    }`}
                  >
                    <div className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-70">
                      {m.role === 'user' ? 'CUSTOMER' : `ADA · ${m.source ?? 'cloud'}`}
                    </div>
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  </div>
                </div>
              ))}
              {pending && (
                <div className="flex justify-start">
                  <div className="bg-[#fffaf3] border-2 border-[#ff6b00]/40 p-4 text-xs uppercase tracking-widest text-[#ff6b00] animate-pulse">
                    ADA composing…
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t-2 border-[#1a1a1a] p-4 flex gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask ADA about cuts, boxes, gifting, delivery…"
                className="flex-1 px-4 py-3 border-2 border-gray-200 focus:border-[#ff6b00] outline-none text-sm font-mono"
                disabled={pending}
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                className="px-6 py-3 bg-[#ff6b00] text-white text-xs font-black uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#1a1a1a] text-white p-6">
            <h2 className="text-xs font-black mb-4 tracking-widest text-[#ff6b00] uppercase">
              Quick Openers
            </h2>
            <div className="space-y-2">
              {QUICK_PROMPTS.map(q => (
                <button
                  key={q}
                  onClick={() => !pending && send(q)}
                  disabled={pending}
                  className="block w-full text-left text-xs py-2 px-3 border border-white/20 hover:border-[#ff6b00] hover:text-[#ff6b00] transition-colors disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border-2 border-[#1a1a1a] p-6">
            <h2 className="text-xs font-black mb-3 uppercase tracking-widest border-l-4 border-[#ff6b00] pl-3">
              Agent Config
            </h2>
            <ul className="text-[11px] space-y-2 text-gray-700">
              <li>
                <span className="text-gray-400">MODEL</span> ·{' '}
                <span className="font-bold">SALES_AGENT_MODEL env</span>
              </li>
              <li>
                <span className="text-gray-400">ROUTER</span> ·{' '}
                <span className="font-bold">CLOUD_MODEL_BASE_URL</span>
              </li>
              <li>
                <span className="text-gray-400">FALLBACK</span> ·{' '}
                <span className="font-bold">Deterministic catalog</span>
              </li>
              <li>
                <span className="text-gray-400">PERSONA</span> ·{' '}
                <span className="font-bold">ADA — StudEx concierge</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#fffaf3] border-2 border-[#ff6b00]/40 p-6">
            <h2 className="text-xs font-black mb-3 uppercase tracking-widest text-[#ff6b00]">
              Pattern Source
            </h2>
            <p className="text-[11px] leading-relaxed text-gray-700">
              Conversation loop and tool-routing pattern adapted from{' '}
              <span className="font-bold">nazirlouis/ada_v2</span>. Voice and CAD tools are out of
              scope for the sales channel — only the dialog state machine carries over.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
