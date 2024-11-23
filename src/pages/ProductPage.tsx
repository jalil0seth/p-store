import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Shield, Award, Clock, Check, Star, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function ProductPage() {
  const { id } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  // In a real app, fetch product data based on ID
  const product = {
    id: id || 'adobe-cc',
    name: 'Adobe Creative Cloud',
    description: 'Complete collection of 20+ creative desktop and mobile apps including Photoshop, Illustrator, InDesign, Premiere Pro, and more.',
    price: { monthly: 54.99, annual: 49.99 },
    image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=1200&h=600',
    rating: 4.9,
    reviews: 2547,
    features: [
      'Access to all Creative Cloud apps',
      '100GB of cloud storage',
      'Adobe Fonts',
      'Adobe Portfolio',
      'Premium features and services',
    ],
    specs: {
      'System Requirements': ['Windows 10 or macOS Catalina', '8GB RAM minimum', 'GPU with DirectX 12 support'],
      'License Type': ['Subscription-based', 'Monthly or annual billing', 'Cancellation available'],
      'Support': ['24/7 technical support', 'Online tutorials', 'Community forums'],
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-[70rem] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Left Column - Image and Features */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[400px] object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { icon: Shield, text: 'Official License' },
                { icon: Award, text: 'Premium Support' },
                { icon: Clock, text: 'Instant Delivery' }
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <Icon className="w-6 h-6 mb-2 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-sm text-gray-600">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">{product.reviews} reviews</span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-8">{product.description}</p>

              {/* Pricing Toggle */}
              <div className="bg-gray-50 p-2 rounded-full inline-flex mb-6">
                {['monthly', 'annual'].map((plan) => (
                  <button
                    key={plan}
                    onClick={() => setSelectedPlan(plan)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedPlan === plan
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {plan.charAt(0).toUpperCase() + plan.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-4xl font-bold">${product.price[selectedPlan]}</span>
                  <span className="text-gray-600">/mo</span>
                  {selectedPlan === 'annual' && (
                    <div className="text-green-600 text-sm font-medium mt-1">
                      Save 10% with annual billing
                    </div>
                  )}
                </div>
                <button
                  onClick={() => addItem({ 
                    id: product.id, 
                    name: product.name, 
                    price: product.price[selectedPlan] 
                  })}
                  className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-medium text-white transition-all hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                  <div className="absolute inset-0 rounded-full bg-blue-600 opacity-25 blur-lg transition-all group-hover:opacity-50" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-xl font-bold mb-4">Features</h2>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <Check className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-600">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-xl font-bold mb-4">Specifications</h2>
              {Object.entries(product.specs).map(([category, items]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="font-medium mb-2">{category}</h3>
                  <ul className="space-y-2">
                    {items.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center space-x-3 text-gray-600"
                      >
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}