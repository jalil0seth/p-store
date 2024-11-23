import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Shield, Award, Clock, Check, Star, ArrowRight, Box, Zap, Globe } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function ProductPage() {
  const { id } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [activeTab, setActiveTab] = useState('overview');

  // In a real app, fetch product data based on ID
  const product = {
    id: id || 'adobe-cc',
    name: 'Adobe Creative Cloud',
    description: 'Complete collection of 20+ creative desktop and mobile apps including Photoshop, Illustrator, InDesign, Premiere Pro, and more.',
    price: { monthly: 54.99, annual: 49.99 },
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/12/372690413/AN/EO/SN/3538534/adobe-creative-cloud-software-2023-500x500.jpg',
    rating: 4.9,
    reviews: 2547,
    features: [
      'Access to all Creative Cloud apps',
      '100GB of cloud storage',
      'Adobe Fonts',
      'Adobe Portfolio',
      'Premium features and services',
      'Latest updates and features',
      'Mobile apps included',
      '24/7 technical support'
    ],
    benefits: [
      { icon: Box, title: 'Complete Suite', text: 'Access to all Adobe Creative Cloud apps' },
      { icon: Zap, title: 'Instant Access', text: 'Start using immediately after purchase' },
      { icon: Globe, title: 'Use Anywhere', text: 'Access your tools on any device' }
    ],
    specs: {
      'System Requirements': ['Windows 10 or macOS Catalina', '8GB RAM minimum', 'GPU with DirectX 12 support'],
      'License Type': ['Subscription-based', 'Monthly or annual billing', 'Cancellation available'],
      'Support': ['24/7 technical support', 'Online tutorials', 'Community forums'],
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'specs', label: 'Specifications' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-[80rem] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-12"
        >
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[500px] object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded-full">
                  Best Seller
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">{product.reviews} reviews</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold">{product.name}</h1>
              <p className="text-xl text-gray-600">{product.description}</p>

              <div className="bg-gray-50 p-2 rounded-full inline-flex">
                {['monthly', 'annual'].map((plan) => (
                  <button
                    key={plan}
                    onClick={() => setSelectedPlan(plan)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedPlan === plan
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {plan.charAt(0).toUpperCase() + plan.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-8">
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
                  className="flex-1 btn btn-primary py-4"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Shield, text: 'Official License' },
                  { icon: Award, text: 'Premium Support' },
                  { icon: Clock, text: 'Instant Delivery' }
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <Icon className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                    <span className="text-sm text-gray-600">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {product.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <benefit.icon className="w-8 h-8 text-primary-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex gap-8 border-b mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 text-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Product Overview</h3>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4">Key Features</h3>
                    <ul className="space-y-3">
                      {product.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-primary-500" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {product.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <Check className="w-5 h-5 text-primary-500" />
                      <span className="text-gray-600">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {Object.entries(product.specs).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="font-semibold mb-4">{category}</h3>
                      <ul className="space-y-2">
                        {items.map((item, index) => (
                          <li key={index} className="flex items-center gap-3 text-gray-600">
                            <ArrowRight className="w-4 h-4 text-primary-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}