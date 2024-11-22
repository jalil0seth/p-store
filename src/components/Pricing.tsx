import React from 'react';
import { Check } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '29',
      description: 'Perfect for individual developers',
      features: [
        'Up to 3 projects',
        'Basic CI/CD pipeline',
        'Community support',
        '5GB storage',
        'Basic analytics'
      ]
    },
    {
      name: 'Pro',
      price: '99',
      description: 'For growing development teams',
      features: [
        'Unlimited projects',
        'Advanced CI/CD pipeline',
        'Priority support',
        '50GB storage',
        'Advanced analytics',
        'Custom domains',
        'Team collaboration'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '299',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Dedicated support',
        'Unlimited storage',
        'Custom integrations',
        'SLA guarantee',
        'Advanced security',
        'Custom training'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Flexible pricing options for teams of all sizes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-white border-2 border-indigo-600 shadow-xl scale-105' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.popular && (
                <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}