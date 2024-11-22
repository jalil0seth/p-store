import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function TechSpecs() {
  const specs = {
    'Performance': [
      'Sub-millisecond response time',
      'Distributed caching layer',
      'Automatic load balancing',
      'Global CDN integration'
    ],
    'Security': [
      'SOC2 Type II certified',
      'End-to-end encryption',
      'Multi-factor authentication',
      'Role-based access control'
    ],
    'Scalability': [
      'Horizontal scaling',
      'Auto-scaling capabilities',
      'Multi-region deployment',
      'Zero-downtime updates'
    ],
    'Integration': [
      'RESTful API',
      'GraphQL support',
      'Webhook capabilities',
      'Custom SDK support'
    ]
  };

  return (
    <section id="specs" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Technical Specifications
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enterprise-grade infrastructure built for scale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {Object.entries(specs).map(([category, items]) => (
            <div key={category} className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{category}</h3>
              <ul className="space-y-4">
                {items.map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}