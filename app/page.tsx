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
      <span className="text-[10px] text-orange-400 uppercase tracking-widest">{city}</span>
      <span className="text-sm font-bold text-[#f5f5f0]">{time}</span>
    </div>
  );
};

export default function Home() {
  const [speed, setSpeed] = useState('FETCHING...');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#f5f5f0] flex items-center justify-center font-mono">
        <div className="bg-white p-12 border-4 border-[#ff4500] shadow-[10px_10px_0px_#ff4500]">
          <h1 className="text-2xl font-bold mb-6 text-[#1a1a1a]">STUDEX ACCESS GATEWAY</h1>
          <input 
            type="password" 
            placeholder="ENTER PROTOCOL"
            className="w-full p-2 border-2 border-[#1a1a1a] mb-4 outline-none focus:border-[#ff4500]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            onClick={() => password === '12345' ? setIsLoggedIn(true) : alert('DENIED')}
            className="w-full bg-[#1a1a1a] text-white p-2 font-bold hover:bg-[#ff4500] transition-colors"
          >
            AUTHORIZE
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] p-6 font-mono selection:bg-orange-200">
      {/* Header with Global Clocks */}
      <header className="mb-8 border-b-2 border-orange-500/30 pb-4">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#1a1a1a] flex items-center justify-center border-2 border-[#ff4500]">
              <span className="text-[#ffff00] font-black text-xl italic">SX</span>
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-[#1a1a1a]">
                HERMES <span className="text-[#ff4500]">COMMAND</span>
              </h1>
              <p className="text-[10px] text-orange-600 font-bold tracking-[0.2em]">AGENT LORD // SENTINEL CTO</p>
            </div>
          </div>
          <div className="flex gap-2">
            <TimeZoneClock city="London" zone="Europe/London" />
            <TimeZoneClock city="Dubai" zone="Asia/Dubai" />
            <TimeZoneClock city="Beijing" zone="Asia/Shanghai" />
            <TimeZoneClock city="S. Africa" zone="Africa/Johannesburg" />
            <TimeZoneClock city="SF" zone="America/Los_Angeles" />
          </div>
        </div>
        
        {/* Smasher Branding Overlay (Subtle) */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none grayscale">
           {/* Placeholder for Adam Smasher asset */}
           <div className="w-96 h-96 bg-gradient-to-bl from-orange-500 to-transparent"></div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Swarm Control */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <section className="bg-white border-2 border-orange-500/20 p-6 shadow-sm">
            <h2 className="text-sm font-bold mb-4 border-l-4 border-[#ff4500] pl-2 uppercase">Active Swarm Triad</h2>
            <div className="grid grid-cols-3 gap-4">
              {['HERMES', 'OPENCLAW', 'CODEX'].map(agent => (
                <div key={agent} className="p-4 border border-orange-100 bg-[#fafaf7] hover:border-[#ff4500] transition-all">
                  <h3 className="font-bold text-sm">{agent}</h3>
                  <p className="text-[10px] text-orange-600 mb-4 italic">API: CONNECTED</p>
                  <button className="w-full text-[10px] bg-[#1a1a1a] text-white py-1 font-bold">ACTIVATE</button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border-2 border-orange-500/20 p-6 shadow-sm">
            <h2 className="text-sm font-bold mb-4 border-l-4 border-blue-500 pl-2 uppercase">Cursor Cloud Agents</h2>
            <div className="flex gap-4">
              <button className="flex-1 p-4 border border-blue-100 bg-blue-50/30 hover:bg-blue-50 text-blue-800 text-xs font-bold">
                INITIATE CLOUD REFACTORING
              </button>
              <button className="flex-1 p-4 border border-blue-100 bg-blue-50/30 hover:bg-blue-50 text-blue-800 text-xs font-bold">
                SYNC CURSOR CONTEXT
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar Diagnostics */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#1a1a1a] text-white p-6 border-b-4 border-[#ff4500]">
            <h2 className="text-xs font-bold mb-4 tracking-widest text-orange-400">SYSTEM DIAGNOSTICS</h2>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>NET_SPEED</span>
                <span className="text-[#ffff00]">842 MB/S</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>LOCAL_IP</span>
                <span className="text-orange-400">172.19.3.154</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>UPTIME</span>
                <span className="text-green-400">99.9%</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-orange-500/20 p-6">
            <h2 className="text-xs font-bold mb-4 uppercase">Internal Swarm Mesh</h2>
            <div className="space-y-2">
               <div className="w-full bg-orange-100 h-1 rounded-full overflow-hidden">
                 <div className="bg-[#ff4500] h-full w-[85%]"></div>
               </div>
               <p className="text-[9px] text-gray-400 italic text-right italic">Syncing across 5 regional nodes...</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-8 right-8 flex gap-4">
        <a href="/memory" className="bg-white border-2 border-[#1a1a1a] px-4 py-2 text-xs font-bold hover:bg-[#ff4500] hover:text-white transition-all shadow-[4px_4px_0px_#1a1a1a]">MEMORY</a>
        <a href="/horizon" className="bg-white border-2 border-[#1a1a1a] px-4 py-2 text-xs font-bold hover:bg-[#ff4500] hover:text-white transition-all shadow-[4px_4px_0px_#1a1a1a]">HORIZON</a>
      </nav>
    </main>
  );
}
