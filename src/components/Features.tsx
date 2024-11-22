import React from 'react';
import { 
  Cpu, Database, Lock, Cloud, 
  Zap, Users, Globe, Terminal
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Cpu,
      title: 'AI-Powered Intelligence',
      description: 'Smart code completion and real-time suggestions powered by advanced AI models.'
    },
    {
      icon: Database,
      title: 'Distributed Computing',
      description: 'Scale your development across multiple nodes with our distributed architecture.'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Military-grade encryption and compliance with industry standards.'
    },
    {
      icon: Cloud,
      title: 'Cloud Integration',
      description: 'Seamless integration with major cloud providers and services.'
    },
    {
      icon: Zap,
      title: 'Lightning Performance',
      description: 'Optimized for speed with native performance across all platforms.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Real-time collaboration tools built for modern development teams.'
    },
    {
      icon: Globe,
      title: 'Global CDN',
      description: 'Lightning-fast content delivery through our global network.'
    },
    {
      icon: Terminal,
      title: 'Advanced CLI',
      description: 'Powerful command-line interface for automated workflows.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Development
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to build exceptional software, all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl border border-gray-200 hover:border-indigo-600 transition-colors group"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                <feature.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}