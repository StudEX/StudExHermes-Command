import React from 'react';

const projects = [
  {
    id: 1,
    title: 'StudEx Meat',
    description: 'Premium Ankole and Wagyu cattle genetics combined with AI-driven livestock management. Real-time health monitoring, predictive breeding analytics, and sustainable farming practices.',
    technologies: ['IoT Sensors', 'ML Analytics', 'Cloud Infrastructure'],
    image: '/hero-robot.jpeg',
    highlight: true,
  },
  {
    id: 2,
    title: 'Hermes Command Center',
    description: 'A unified orchestration platform for AI agents. Manages Kimi, GLM, and Minimax models through a single control interface with real-time monitoring and deployment capabilities.',
    technologies: ['Next.js', 'Cloud APIs', 'Agent Orchestration'],
    image: '/bg-cyberpunk.webp',
  },
  {
    id: 3,
    title: 'Sentinel CTO System',
    description: 'Strategic AI governance framework for enterprise deployments. Combines multi-agent systems with secure, auditable decision-making for complex business operations.',
    technologies: ['AI Governance', 'Security', 'Orchestration'],
  },
];

export default function Projects() {
  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-5xl font-black text-gray-900 mb-4">Featured Projects</h2>
          <p className="text-lg text-gray-600">Bridging innovation across agriculture, AI infrastructure, and sustainable business</p>
        </div>

        <div className="space-y-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 rounded-lg transition-all ${
                project.highlight
                  ? 'bg-gradient-to-r from-orange-50 to-white border-2 border-orange-600'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              {project.image && (
                <div className="order-1 lg:order-1">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full rounded-lg shadow-lg object-cover h-64"
                  />
                </div>
              )}
              <div className={project.image ? 'order-2 lg:order-2' : 'col-span-2'}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-3xl font-black text-gray-900">{project.title}</h3>
                  {project.highlight && (
                    <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      FLAGSHIP
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-white border-2 border-orange-600 text-orange-600 text-sm font-bold px-4 py-2 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
