import React from 'react';

export default function About() {
  return (
    <section className="py-20 px-8 bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-black mb-6 text-gray-900 leading-tight">
              Bridging <span className="text-orange-600">Tech & Agriculture</span>
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Tumelo Ramaphosa combines expertise in AI infrastructure with a passion for sustainable agriculture.
              By leveraging cutting-edge technology, I'm transforming traditional farming into a data-driven,
              intelligent ecosystem.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              From Ankole cattle to advanced ML models, every innovation serves a purpose: creating value
              at the intersection of heritage and progress.
            </p>
            <div className="flex gap-6 flex-wrap">
              <div className="border-l-4 border-orange-600 pl-4">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest">AI Architect</h3>
                <p className="text-gray-600 text-sm">Cloud infrastructure & ML ops</p>
              </div>
              <div className="border-l-4 border-orange-600 pl-4">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest">AgTech Pioneer</h3>
                <p className="text-gray-600 text-sm">Sustainable livestock innovation</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="/hero-header.jpeg"
              alt="Tumelo Ramaphosa"
              className="w-full rounded-lg shadow-2xl border-4 border-orange-200"
            />
            <div className="absolute -bottom-4 -right-4 bg-white p-6 rounded-lg shadow-xl border-2 border-orange-600 max-w-sm">
              <p className="text-sm font-bold text-gray-900 mb-2">Expertise Areas</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Cloud Architecture</li>
                <li>• AI/ML Infrastructure</li>
                <li>• Sustainable Agriculture</li>
                <li>• Livestock Technology</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
