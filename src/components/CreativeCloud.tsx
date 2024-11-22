import React from 'react';
import { Code2, Palette, Video, Image, Database, Globe } from 'lucide-react';

export default function CreativeCloud() {
  const apps = [
    { icon: Code2, name: 'DevForge Pro', color: 'blue' },
    { icon: Palette, name: 'DesignStudio', color: 'purple' },
    { icon: Video, name: 'VideoMaster', color: 'pink' },
    { icon: Image, name: 'ImageLab', color: 'green' },
    { icon: Database, name: 'DataForge', color: 'orange' },
    { icon: Globe, name: 'WebStudio', color: 'indigo' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            All Your Creative Tools in One Place
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access our entire collection of professional creative and development tools
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
          {apps.map((app, index) => (
            <div 
              key={index}
              className="group cursor-pointer"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-${app.color}-100`}>
                <app.icon className={`w-8 h-8 text-${app.color}-600`} />
              </div>
              <h3 className="text-center font-semibold text-gray-900">{app.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}