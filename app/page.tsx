import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded flex items-center justify-center">
              <span className="text-white font-black text-sm">TR</span>
            </div>
            <span className="font-black text-lg text-gray-900">Tumelo</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#about" className="text-gray-700 font-bold hover:text-orange-600 transition-colors">About</a>
            <a href="#projects" className="text-gray-700 font-bold hover:text-orange-600 transition-colors">Projects</a>
            <a href="#contact" className="text-gray-700 font-bold hover:text-orange-600 transition-colors">Contact</a>
            <a href="/sentinel" className="bg-orange-600 text-white px-6 py-2 rounded font-bold hover:bg-orange-700 transition-colors">Command Center</a>
          </nav>
        </div>
      </header>

      <Hero />

      <section id="about" className="scroll-mt-20">
        <About />
      </section>

      <section id="projects" className="scroll-mt-20">
        <Projects />
      </section>

      <section id="contact" className="scroll-mt-20">
        <Contact />
      </section>

      <footer className="bg-gray-900 text-white py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-600 rounded flex items-center justify-center">
                  <span className="text-white font-black text-sm">TR</span>
                </div>
                <span className="font-black">Tumelo</span>
              </div>
              <p className="text-gray-400 text-sm">Building the future of AI-driven agriculture</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-orange-600 transition-colors">About</a></li>
                <li><a href="#projects" className="hover:text-orange-600 transition-colors">Projects</a></li>
                <li><a href="#contact" className="hover:text-orange-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Expertise</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>AI Infrastructure</li>
                <li>Cloud Architecture</li>
                <li>AgTech Innovation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <p className="text-sm text-gray-400 mb-2">t.ramaphosa@studex.dev</p>
              <p className="text-sm text-gray-400">South Africa</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Tumelo Ramaphosa. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
