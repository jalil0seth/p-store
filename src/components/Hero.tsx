import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Sparkles, Check } from 'lucide-react';
import { PARTNERS } from '../utils/constants';

export default function Hero() {
  const benefits = [
    'Official Software Licenses',
    'Instant Digital Delivery',
    'Enterprise Support 24/7',
    'Best Price Guarantee'
  ];

  return (
    <section className="relative pt-24 pb-16">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,123,255,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.1),transparent)]" />
      </div>

      <div className="container-width relative">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-primary-100 text-primary-600 mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Save up to 40% on Premium Software</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500">
              Premium Software
            </span>
            <br />
            <span className="mt-2 block">For Modern Teams</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
          >
            Get instant access to premium software licenses at competitive prices, 
            backed by our official partnership guarantees.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link 
              to="/products" 
              className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4 text-lg font-medium text-white transition-all hover:from-primary-600 hover:to-primary-700 hover:scale-105 w-full sm:w-auto"
            >
              Browse Software
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-primary-500 opacity-25 blur-xl transition-all group-hover:opacity-50" />
            </Link>
            <Link 
              to="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-medium text-gray-900 shadow-md transition-all hover:shadow-lg hover:scale-105 w-full sm:w-auto border border-gray-200"
            >
              <Shield className="w-5 h-5" />
              Contact Sales
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-primary-500" />
                <span>{benefit}</span>
              </li>
            ))}
          </motion.ul>

          {/* Trusted Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-8 shadow-xl"
          >
            <p className="text-sm text-gray-500 mb-6">Trusted by leading companies worldwide</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {PARTNERS.map((partner, i) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.8 }}
                  className="flex items-center justify-center group"
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="h-12 w-auto grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}