import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1a0033] text-[#ffff00] p-8 font-mono border-4 border-[#ffff00]">
      <header className="mb-12 border-b-2 border-[#ff00ff] pb-4 flex justify-between items-center">
        <h1 className="text-4xl font-bold italic tracking-tighter shadow-[0_0_15px_#ff00ff]">
          STUDEX HERMES COMMAND
        </h1>
        <div className="text-right">
          <p className="text-sm">AGENT LORD: AUTHORIZED</p>
          <p className="text-xs text-[#ff00ff]">SENTINEL CTO ACTIVE</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="border-2 border-[#ff00ff] p-6 bg-black/40 hover:bg-[#ff00ff]/10 transition-colors cursor-pointer group">
          <h2 className="text-xl mb-4 group-hover:underline">🚀 HERMES</h2>
          <p className="text-sm text-gray-400">Content & Creative Engine</p>
          <p className="mt-2 text-xs">MODEL: KIMI-K2.6:CLOUD</p>
          <button className="mt-4 bg-[#ffff00] text-black px-4 py-1 font-bold text-xs">LAUNCH</button>
        </div>
        
        <div className="border-2 border-[#ff00ff] p-6 bg-black/40 hover:bg-[#ff00ff]/10 transition-colors cursor-pointer group">
          <h2 className="text-xl mb-4 group-hover:underline">🛡️ OPENCLAW</h2>
          <p className="text-sm text-gray-400">Logic & Security Auditor</p>
          <p className="mt-2 text-xs">MODEL: GLM-5.1:CLOUD</p>
          <button className="mt-4 bg-[#ffff00] text-black px-4 py-1 font-bold text-xs">LAUNCH</button>
        </div>

        <div className="border-2 border-[#ff00ff] p-6 bg-black/40 hover:bg-[#ff00ff]/10 transition-colors cursor-pointer group">
          <h2 className="text-xl mb-4 group-hover:underline">💻 CODEX</h2>
          <p className="text-sm text-gray-400">Code & Optimization</p>
          <p className="mt-2 text-xs">MODEL: MINIMAX-01:CLOUD</p>
          <button className="mt-4 bg-[#ffff00] text-black px-4 py-1 font-bold text-xs">LAUNCH</button>
        </div>
      </div>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-8 bg-black/80 p-4 border-2 border-[#ffff00] shadow-[0_0_20px_#ffff00]">
        <a href="/" className="hover:text-[#ff00ff]">[ COMMAND ]</a>
        <a href="/memory" className="hover:text-[#ff00ff]">[ MEMORY LOG ]</a>
        <a href="/horizon" className="hover:text-[#ff00ff]">[ HORIZON PLAN ]</a>
      </nav>
    </main>
  );
}
