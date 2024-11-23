import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Building2, Users } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'TechFlow Solutions',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150',
    content: 'The software licensing platform has transformed how we manage our team\'s tools. Incredible service and support.',
    rating: 5,
    teamSize: '100-500',
    industry: 'Technology'
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'Engineering Lead',
    company: 'Innovate Inc',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150',
    content: 'Streamlined our entire software procurement process. The automated license management is a game-changer.',
    rating: 5,
    teamSize: '50-100',
    industry: 'Software'
  },
  {
    id: 3,
    name: 'Emily Watson',
    role: 'Design Director',
    company: 'Creative Studios',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150',
    content: 'Finally, a platform that understands enterprise software needs. The support team is exceptional.',
    rating: 5,
    teamSize: '10-50',
    industry: 'Design'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Product Manager',
    company: 'Global Tech',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150',
    content: 'Best prices for premium software licenses. The instant delivery system works flawlessly.',
    rating: 5,
    teamSize: '500+',
    industry: 'Enterprise'
  },
  {
    id: 5,
    name: 'Lisa Johnson',
    role: 'IT Director',
    company: 'SecureNet',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&h=150',
    content: 'Enterprise-grade security and compliance features make this platform stand out from the competition.',
    rating: 5,
    teamSize: '100-500',
    industry: 'Security'
  }
];

const STATS = [
  { label: 'Happy Customers', value: '10,000+' },
  { label: 'Countries Served', value: '150+' },
  { label: 'Enterprise Clients', value: '500+' },
  { label: 'Customer Satisfaction', value: '99.9%' }
];

export default function Reviews() {
  return (
    <section className="py-20 bg-white">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Trusted by Industry Leaders
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join thousands of satisfied customers worldwide
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {STATS.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-100" />
              
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={review.image}
                  alt={review.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-white"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-600">{review.role}</p>
                  <p className="text-sm text-primary-600">{review.company}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-600 mb-6">"{review.content}"</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{review.industry}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{review.teamSize} employees</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}