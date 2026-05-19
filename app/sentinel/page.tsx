import React from 'react';

export default function SentinelPortal() {
  const sentinelAgents = [
    { name: 'SENTINEL-CORE', role: 'CTO Orchestrator', status: 'ACTIVE', local: true },
    { name: 'CURSOR-EXECUTOR', role: 'Code Refiner', status: 'READY', local: false },
    { name: 'NAS-ARCHIVIST', role: 'Memory Management', status: 'SYNCING', local: true }
  ];

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#1a1a1a] p-8 font-mono">
      <header className="mb-12 border-b-2 border-[#ff6b00] pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-[#1a1a1a]">
            SENTINEL <span className="text-[#ff6b00]">PORTAL</span>
          </h1>
          <p className="text-xs font-bold text-orange-600 mt-2 tracking-widest uppercase">Agent Control & Local Mesh</p>
        </div>
        <div className="text-right text-[10px] font-bold">
          <p>ENGINE: MLX (OPTIMIZED)</p>
          <p>LOCAL_MODEL: GEMMA-4</p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Sentinel's Personal Agents */}
        <div className="col-span-8 space-y-6">
          <section className="bg-white border-2 border-orange-100 p-8 shadow-sm">
            <h2 className="text-xs font-black mb-8 border-l-4 border-[#ff6b00] pl-4 uppercase tracking-[0.2em]">Sentinel Sub-Agents</h2>
            <div className="grid grid-cols-2 gap-6">
              {sentinelAgents.map(agent => (
                <div key={agent.name} className="p-6 border border-gray-100 bg-[#fafafa] hover:border-orange-200 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-sm">{agent.name}</h3>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full ${agent.local ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      {agent.local ? 'LOCAL' : 'CLOUD'}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-6">{agent.role}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 bg-[#1a1a1a] text-white text-[9px] font-black uppercase">Command</button>
                    <button className="flex-1 py-1.5 border border-[#1a1a1a] text-[9px] font-black uppercase">Logs</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#1a1a1a] text-white p-8 border-l-8 border-[#ff6b00]">
             <h2 className="text-xs font-black mb-6 tracking-widest text-orange-400 uppercase">Cursor Agent Bridge</h2>
             <p className="text-[10px] text-gray-400 mb-6">Automated code-writing and refactoring bridge between local Sentinel core and Cursor cloud agents.</p>
             <button className="w-full py-3 bg-[#ff6b00] text-black font-black text-xs uppercase hover:bg-orange-400 transition-colors">
                Initiate Remote Cursor Refactoring Session
             </button>
          </section>
        </div>

        {/* Local Performance & NAS */}
        <div className="col-span-4 space-y-8">
          <div className="bg-white border-2 border-[#1a1a1a] p-6 shadow-[8px_8px_0px_#ff6b00]">
            <h2 className="text-xs font-black mb-6 uppercase tracking-widest">NAS Connection</h2>
            <div className="p-4 bg-orange-50 border border-orange-100 text-[10px] space-y-2">
              <div className="flex justify-between"><span>STATUS:</span> <span className="text-orange-600 font-bold">READY TO MOUNT</span></div>
              <div className="flex justify-between"><span>PATH:</span> <span>/volumes/studex_nas</span></div>
            </div>
          </div>

          <div className="bg-[#f5f5f0] border-2 border-dashed border-gray-300 p-6">
            <h2 className="text-xs font-black mb-6 uppercase text-gray-500 tracking-widest">In-Flight Tasks</h2>
            <ul className="text-[9px] space-y-3 italic text-gray-400">
              <li>- Optimizing Gemma 4 for MLX inference...</li>
              <li>- Syncing local memories to NAS volume...</li>
              <li>- Waiting for Agent Lord authorization...</li>
            </ul>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-8 bg-white p-4 border-2 border-[#1a1a1a] shadow-xl">
        <a href="/" className="hover:text-[#ff6b00] text-xs font-bold">[ COMMAND ]</a>
        <a href="/sentinel" className="text-[#ff6b00] text-xs font-bold underline">[ SENTINEL ]</a>
        <a href="/horizon" className="hover:text-[#ff6b00] text-xs font-bold">[ HORIZON ]</a>
      </nav>
    </main>
  );
}
