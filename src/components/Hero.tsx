import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-dots bg-dots-lg opacity-20" />
      <div className="absolute inset-0 bg-gradient-radial from-blue-50 to-transparent opacity-60" />
      
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 mb-8 rounded-full bg-white/50 backdrop-blur-sm border border-blue-100 hover-lift">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Premium Software Provider</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="gradient-text">Professional Software</span>
            <br />
            <span className="text-gray-900">For Modern Teams</span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Get instant access to premium software licenses at competitive prices, 
            backed by our official partnership guarantees.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a 
              href="#products" 
              className="btn btn-primary group w-full sm:w-auto text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Browse Software
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <a 
              href="#contact" 
              className="btn btn-secondary w-full sm:w-auto text-lg"
            >
              Contact Sales
            </a>
          </div>

          {/* Floating Cards Effect */}
          <div className="relative mt-20">
            <div className="absolute inset-0 bg-gradient-radial from-blue-50 to-transparent opacity-60" />
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2, duration: 0.5 }}
                  className="glass-card p-6 rounded-2xl animate-float"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <img
                    src={`https://images.unsplash.com/photo-${1550000000000 + i}?auto=format&fit=crop&w=300&h=200`}
                    alt="Software Preview"
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <div className="h-2 w-20 bg-gradient-to-r from-blue-200 to-blue-100 rounded-full" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}