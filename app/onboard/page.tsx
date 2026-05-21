'use client';

import React, { useState } from 'react';

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function OnboardPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', interest: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  function update(field: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setMessage('');
    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, channel: 'onboard-page' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data?.error ?? 'Something went wrong. Try again.');
        return;
      }
      setStatus('done');
      setMessage("You're in. ADA will reach out shortly to get you set up.");
    } catch {
      setStatus('error');
      setMessage('Network error. Please retry.');
    }
  }

  if (status === 'done') {
    return (
      <main className="min-h-screen bg-[#fcfaf8] text-[#1a1a1a] flex items-center justify-center font-mono p-8">
        <div className="bg-white border-4 border-[#1a1a1a] shadow-[12px_12px_0px_#ff6b00] p-12 max-w-md text-center">
          <div className="w-16 h-16 bg-[#1a1a1a] flex items-center justify-center border-2 border-[#ff6b00] mx-auto mb-6">
            <span className="text-[#ffff00] font-black text-xl italic">SX</span>
          </div>
          <h1 className="text-2xl font-black uppercase mb-4">Welcome aboard</h1>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#1a1a1a] flex items-center justify-center font-mono p-8">
      <div className="bg-white border-4 border-[#1a1a1a] shadow-[12px_12px_0px_#ff6b00] p-10 w-full max-w-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-[#1a1a1a] flex items-center justify-center border-2 border-[#ff6b00]">
            <span className="text-[#ffff00] font-black text-lg italic">SX</span>
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Get Started with StudEx</h1>
            <p className="text-[10px] text-orange-600 font-bold tracking-widest uppercase">Client Onboarding</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">Name *</label>
            <input
              value={form.name}
              onChange={e => update('name', e.target.value)}
              required
              className="w-full p-3 border-2 border-gray-200 focus:border-[#ff6b00] outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              required
              className="w-full p-3 border-2 border-gray-200 focus:border-[#ff6b00] outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">Company</label>
            <input
              value={form.company}
              onChange={e => update('company', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 focus:border-[#ff6b00] outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">What are you looking for?</label>
            <textarea
              value={form.interest}
              onChange={e => update('interest', e.target.value)}
              rows={3}
              className="w-full p-3 border-2 border-gray-200 focus:border-[#ff6b00] outline-none text-sm resize-none"
            />
          </div>

          {status === 'error' && <p className="text-xs text-red-600 font-bold">{message}</p>}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-4 bg-[#ff6b00] text-white text-xs font-black uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors disabled:opacity-40"
          >
            {status === 'sending' ? 'Submitting…' : 'Sign Me Up'}
          </button>
        </form>
      </div>
    </main>
  );
}
