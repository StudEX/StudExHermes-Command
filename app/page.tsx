'use client';

import React, { useState, useEffect } from 'react';

const TimeZoneClock = ({ city, zone }: { city: string, zone: string }) => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Intl.DateTimeFormat('en-GB', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, [zone]);
  return (
    <div className="flex flex-col items-center p-2 border border-orange-200/20 rounded bg-white/5">
      <span className="text-[10px] text-orange-500 uppercase tracking-widest">{city}</span>
      <span className="text-sm font-bold text-gray-800">{time}</span>
    </div>
  );
};

const SpeedMonitor = () => {
  const [speed, setSpeed] = useState(842);
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prev => Math.max(800, Math.min(950, prev + (Math.random() * 10 - 5))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return <span className="text-[#ff6b00] font-bold">{speed.toFixed(1)} MB/S</span>;
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [hermesStatus, setHermesStatus] = useState('IDLE');

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#fcfaf8] flex items-center justify-center font-mono">
        <div className="bg-white p-12 border-2 border-[#ff6b00] shadow-[20px_20px_0px_#1a1a1a]">
          <div className="flex justify-center mb-8">
             <div className="w-20 h-20 bg-[#1a1a1a] flex items-center justify-center border-2 border-[#ff6b00] rotate-45">
                <span className="text-[#ffff00] font-black text-2xl -rotate-45">SX</span>
             </div>
          </div>
          <h1 className="text-xl font-black mb-6 text-center tracking-widest text-[#1a1a1a]">STUDEX ACCESS GATEWAY</h1>
          <input 
            type="password" 
            placeholder="PROTOCOL_KEY"
            className="w-full p-3 border-2 border-gray-200 mb-4 outline-none focus:border-[#ff6b00] text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            onClick={() => password === '12345' ? setIsLoggedIn(true) : alert('DENIED')}
            className="w-full bg-[#1a1a1a] text-white p-3 font-bold hover:bg-[#ff6b00] transition-all transform active:scale-95"
          >
            AUTHORIZE SESSION
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#1a1a1a] p-8 font-mono selection:bg-orange-100">
      {/* Background Smasher Watermark */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center overflow-hidden">
        <div className="w-[800px] h-[800px] bg-orange-500 rounded-full blur-[100px] absolute -top-40 -right-40"></div>
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/3/3b/Adam_Smasher_Cyberpunk_2077.png" 
          alt="Adam Smasher" 
          className="w-full max-w-4xl object-contain"
        />
      </div>

      <header className="relative z-10 mb-12 flex justify-between items-start border-b border-orange-100 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#1a1a1a] flex items-center justify-center border-2 border-[#ff6b00] group cursor-pointer hover:rotate-12 transition-transform">
            <span className="text-[#ffff00] font-black text-xl italic">SX</span>
          </div>
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter">
              HERMES <span className="text-[#ff6b00]">COMMAND</span>
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[10px] bg-[#1a1a1a] text-white px-2 py-0.5 font-bold">AGENT LORD</span>
              <span className="text-[10px] border border-orange-500 text-orange-600 px-2 py-0.5 font-bold">SENTINEL CTO</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          <TimeZoneClock city="London" zone="Europe/London" />
          <TimeZoneClock city="Dubai" zone="Asia/Dubai" />
          <TimeZoneClock city="Beijing" zone="Asia/Shanghai" />
          <TimeZoneClock city="S. Africa" zone="Africa/Johannesburg" />
          <TimeZoneClock city="SF" zone="America/Los_Angeles" />
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-12 gap-8">
        {/* Left Column: Swarm & Cursor */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <section className="bg-white border border-gray-100 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-[#ff6b00]"></div>
            <h2 className="text-xs font-black mb-6 tracking-widest text-gray-400 uppercase">ACTIVE SWARM TRIAD (LOCAL MESH)</h2>
            <div className="grid grid-cols-3 gap-6">
              {[
                { name: 'HERMES', model: 'KIMI-K2.6:CLOUD', color: 'orange' },
                { name: 'OPENCLAW', model: 'GLM-5.1:CLOUD', color: 'blue' },
                { name: 'CODEX', model: 'MINIMAX-01:CLOUD', color: 'green' }
              ].map(agent => (
                <div key={agent.name} className="p-6 border border-gray-50 bg-[#fafafa] group hover:border-orange-200 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg">{agent.name}</h3>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-6">{agent.model}</p>
                  <button 
                    onClick={() => agent.name === 'HERMES' && setHermesStatus('CONNECTED')}
                    className="w-full py-2 bg-[#1a1a1a] text-white text-[10px] font-black tracking-widest hover:bg-[#ff6b00] transition-colors"
                  >
                    DEPLOY
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xs font-black mb-6 tracking-widest text-gray-400 uppercase">CURSOR CLOUD AGENTS (REMOTE CONTROL)</h2>
            <div className="flex gap-6">
              <button className="flex-1 p-6 border-2 border-dashed border-gray-200 hover:border-blue-400 group transition-all">
                <span className="block text-sm font-bold group-hover:text-blue-600">INITIATE CLOUD REFACTOR</span>
                <span className="text-[10px] text-gray-400 italic">Syncing via secure SSH tunnel...</span>
              </button>
              <button className="flex-1 p-6 border-2 border-dashed border-gray-200 hover:border-blue-400 group transition-all">
                <span className="block text-sm font-bold group-hover:text-blue-600">DEPLOY CLOUD COMPOSER</span>
                <span className="text-[10px] text-gray-400 italic">Targeting production branch...</span>
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Diagnostics & API */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-[#1a1a1a] text-white p-8 shadow-xl border-t-8 border-[#ff6b00]">
            <h2 className="text-xs font-black mb-8 tracking-[0.3em] text-orange-400">SYSTEM DIAGNOSTICS</h2>
            <div className="space-y-6 text-sm font-bold">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-500 text-[10px]">NET_STABILITY</span>
                <SpeedMonitor />
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-500 text-[10px]">LOCAL_MESH_IP</span>
                <span className="text-orange-200">172.19.3.154</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-500 text-[10px]">HERMES_API</span>
                <span className="text-green-400">{hermesStatus}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-orange-100 p-8 shadow-sm">
            <h2 className="text-xs font-black mb-4 uppercase text-[#ff6b00]">Hermes API Configuration</h2>
            <div className="space-y-4">
               <div className="p-3 bg-gray-50 text-[10px] font-mono break-all border border-gray-100">
                  ENDPOINT: https://api.studex.group/v1/hermes
               </div>
               <button className="w-full py-2 border-2 border-[#1a1a1a] text-[10px] font-black hover:bg-gray-50 transition-colors">
                 GENERATE NEW API KEY
               </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-8 right-8 flex gap-6 z-50">
        <a href="/memory" className="bg-white border border-gray-200 px-6 py-3 text-xs font-black hover:border-[#ff6b00] hover:text-[#ff6b00] transition-all shadow-xl">MEMORY</a>
        <a href="/horizon" className="bg-[#1a1a1a] text-white px-6 py-3 text-xs font-black hover:bg-[#ff6b00] transition-all shadow-xl">HORIZON</a>
      </nav>
    </main>
  );
}
