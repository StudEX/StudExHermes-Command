import React from 'react';

export default function MemoryPage() {
  const activities = [
    { time: "2026-05-11 14:22", agent: "SENTINEL", action: "Command Center Deployed to http://localhost:3000" },
    { time: "2026-05-11 14:15", agent: "SYSTEM", action: "StudEx Swarm Repositories Cloned & Verified" },
    { time: "2026-05-11 14:05", agent: "SENTINEL", action: "Kimi, Minimax, and GLM-5.1 Cloud Bridges Initialized" },
    { time: "2026-05-11 13:50", agent: "AGENT LORD", action: "Session Initialized - Key Protocol Active" }
  ];

  return (
    <main className="min-h-screen bg-[#1a0033] text-[#ffff00] p-8 font-mono border-4 border-[#ffff00]">
      <header className="mb-12 border-b-2 border-[#ff00ff] pb-4">
        <h1 className="text-4xl font-bold italic tracking-tighter">🧠 MEMORY LOG</h1>
      </header>

      <div className="border-2 border-[#ff00ff] bg-black/80 p-4 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#ffff00] text-[#ff00ff]">
              <th className="pb-2">TIMESTAMP</th>
              <th className="pb-2">AGENT</th>
              <th className="pb-2">ACTIVITY</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((log, i) => (
              <tr key={i} className="border-b border-[#333] hover:bg-[#ff00ff]/10">
                <td className="py-3 text-gray-400">{log.time}</td>
                <td className="py-3 font-bold">{log.agent}</td>
                <td className="py-3">{log.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-8 bg-black/80 p-4 border-2 border-[#ffff00]">
        <a href="/" className="hover:text-[#ff00ff]">[ COMMAND ]</a>
        <a href="/memory" className="text-[#ff00ff] underline">[ MEMORY LOG ]</a>
        <a href="/horizon" className="hover:text-[#ff00ff]">[ HORIZON PLAN ]</a>
      </nav>
    </main>
  );
}
