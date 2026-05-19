import React from 'react';

export default function ShopifyCommand() {
  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#1a1a1a] p-8 font-mono">
      <header className="mb-12 border-b-2 border-[#556b2f] pb-6 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#1a1a1a] flex items-center justify-center border-2 border-[#ff6b00]">
            <span className="text-[#ffff00] font-black text-xl italic">SX</span>
          </div>
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              SHOPIFY <span className="text-[#556b2f]">INTEGRATION</span>
            </h1>
            <p className="text-[10px] text-orange-600 font-bold tracking-widest uppercase mt-1">E-Commerce Swarm Control</p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-block px-3 py-1 bg-[#556b2f] text-white text-[10px] font-bold">
            PREMIUM LOGISTICS ACTIVE
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* API Control Panel */}
        <div className="col-span-12 lg:col-span-7 space-y-8">
          <section className="bg-white border-2 border-[#556b2f]/20 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-[#556b2f]"></div>
            <h2 className="text-xs font-black mb-8 border-l-4 border-[#ff6b00] pl-4 uppercase tracking-widest">Admin API Credentials</h2>
            
            <div className="space-y-6">
              <div className="group">
                <label className="text-[10px] font-bold text-gray-400 block mb-2">ACCESS TOKEN (shpat_...)</label>
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    value="************************"
                    disabled
                    className="flex-1 p-3 bg-gray-50 border border-gray-100 text-xs font-mono"
                  />
                  <button className="px-4 bg-[#1a1a1a] text-white text-[10px] font-bold uppercase hover:bg-[#556b2f] transition-colors">Update</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 bg-[#fafafa]">
                  <p className="text-[10px] text-gray-400 mb-1">SHOP_DOMAIN</p>
                  <p className="text-sm font-bold">studex-meat.myshopify.com</p>
                </div>
                <div className="p-4 border border-gray-100 bg-[#fafafa]">
                  <p className="text-[10px] text-gray-400 mb-1">API_STATUS</p>
                  <p className="text-sm font-bold text-[#556b2f]">CONNECTED</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#1a1a1a] text-white p-8">
            <h2 className="text-xs font-black mb-6 tracking-widest text-[#556b2f] uppercase">Inventory-to-Content Automator</h2>
            <p className="text-[10px] text-gray-400 mb-6 italic">When stock levels change, Hermes will automatically generate new marketing assets.</p>
            <div className="flex gap-4">
              <button className="flex-1 py-3 bg-[#556b2f] text-white font-black text-xs uppercase hover:opacity-90 transition-all">
                Trigger Manual Inventory Sync
              </button>
              <button className="flex-1 py-3 border border-white/20 text-white font-black text-xs uppercase hover:bg-white/5 transition-all">
                View Generated Assets
              </button>
            </div>
          </section>
        </div>

        {/* Sales Diagnostics */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <div className="bg-white border-4 border-[#1a1a1a] p-6 shadow-[10px_10px_0px_#556b2f]">
            <h2 className="text-xs font-black mb-6 uppercase tracking-widest">Real-Time Sales Log</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-[10px] text-gray-400 font-mono">2026-05-11 15:02</span>
                <span className="text-xs font-bold text-[#556b2f]">+$420.00 (Wagyu Gold)</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-[10px] text-gray-400 font-mono">2026-05-11 14:45</span>
                <span className="text-xs font-bold text-[#556b2f]">+$1,250.00 (Ankole T-Bone)</span>
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">View Full Ledger</button>
          </div>

          <div className="bg-[#556b2f] text-white p-6 shadow-sm">
            <h2 className="text-xs font-black mb-4 uppercase">Logistics Security</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                 <div className="w-6 h-6 border-2 border-white animate-spin"></div>
              </div>
              <p className="text-[10px] italic">Decepticon is currently auditing the checkout pipeline...</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-8 bg-white p-4 border-2 border-[#1a1a1a] shadow-xl z-50">
        <a href="/" className="hover:text-[#ff6b00] text-xs font-bold">[ COMMAND ]</a>
        <a href="/sentinel" className="hover:text-[#ff6b00] text-xs font-bold">[ SENTINEL ]</a>
        <a href="/shopify" className="text-[#556b2f] text-xs font-bold underline">[ SHOPIFY ]</a>
        <a href="/horizon" className="hover:text-[#ff6b00] text-xs font-bold">[ HORIZON ]</a>
      </nav>
    </main>
  );
}
