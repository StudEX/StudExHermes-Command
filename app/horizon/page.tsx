import React from 'react';

export default function HorizonPage() {
  return (
    <main className="min-h-screen bg-[#1a0033] text-[#ffff00] p-8 font-mono border-4 border-[#ffff00]">
      <header className="mb-12 border-b-2 border-[#ff00ff] pb-4">
        <h1 className="text-4xl font-bold italic tracking-tighter">🔭 HORIZON PLAN</h1>
      </header>

      <div className="max-w-3xl mx-auto space-y-8">
        <section className="border-2 border-[#ff00ff] p-6 bg-black/60">
          <h2 className="text-2xl mb-4 text-[#ff00ff]">🌌 THE VISION</h2>
          <p>Building an autonomous corporate infrastructure for StudEx Group where agents handle 100% of content, security, and coding.</p>
        </section>

        <section className="border-2 border-[#ffff00] p-6 bg-black/60">
          <h2 className="text-2xl mb-4">📈 MILESTONES</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-4 text-green-400">
              <span className="border border-green-400 px-2">[DONE]</span> 
              <span>PHASE 1: Swarm Assembly & Command Center Deployment</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="border border-[#ffff00] px-2">[NEXT]</span> 
              <span>PHASE 2: E-Commerce Engine & Shopify Integration</span>
            </li>
            <li className="flex items-center gap-4 text-gray-500 italic">
              <span className="border border-gray-500 px-2">[PENDING]</span> 
              <span>PHASE 3: Total Automation & Self-Healing Code</span>
            </li>
          </ul>
        </section>
      </div>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-8 bg-black/80 p-4 border-2 border-[#ffff00]">
        <a href="/" className="hover:text-[#ff00ff]">[ COMMAND ]</a>
        <a href="/memory" className="hover:text-[#ff00ff]">[ MEMORY LOG ]</a>
        <a href="/horizon" className="text-[#ff00ff] underline">[ HORIZON PLAN ]</a>
      </nav>
    </main>
  );
}
