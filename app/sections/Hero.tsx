import React from 'react';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white via-orange-50 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-0 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-6xl lg:text-7xl font-black text-gray-900 mb-4 leading-tight">
                Tumelo <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                  Ramaphosa
                </span>
              </h1>
              <div className="flex items-center gap-4 mt-6">
                <div className="h-1 w-12 bg-orange-600"></div>
                <p className="text-lg font-bold text-gray-700 uppercase tracking-widest">
                  AI Architect & AgTech Pioneer
                </p>
              </div>
            </div>

            <p className="text-2xl text-gray-700 leading-relaxed font-light">
              Building the future where artificial intelligence meets sustainable agriculture.
              Orchestrating cloud infrastructure, AI agents, and premium livestock genetics.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <a
                href="#projects"
                className="inline-block bg-orange-600 text-white px-8 py-4 font-black text-lg rounded hover:bg-orange-700 transition-colors shadow-lg"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="inline-block border-2 border-orange-600 text-orange-600 px-8 py-4 font-black text-lg rounded hover:bg-orange-50 transition-colors"
              >
                Get In Touch
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-gray-200">
              <div>
                <div className="text-3xl font-black text-orange-600">5+</div>
                <p className="text-sm text-gray-600 font-bold">Years in AI</p>
              </div>
              <div>
                <div className="text-3xl font-black text-orange-600">10K+</div>
                <p className="text-sm text-gray-600 font-bold">Cattle Managed</p>
              </div>
              <div>
                <div className="text-3xl font-black text-orange-600">3</div>
                <p className="text-sm text-gray-600 font-bold">AI Agents</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-orange-200 to-orange-100 rounded-2xl p-1 shadow-2xl">
              <img
                src="/hero-header.jpeg"
                alt="Tumelo Ramaphosa"
                className="w-full rounded-xl"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white border-2 border-orange-600 rounded-lg p-6 shadow-xl max-w-xs">
              <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-2">Tech Stack</p>
              <p className="text-sm text-gray-700">Next.js, Cloud APIs, ML Ops, IoT Infrastructure</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
