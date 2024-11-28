import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProductStore } from '../store/productStore';
import ProductGrid from './ProductGrid';

const CATEGORIES = [
  'All',
  'Design',
  'Development',
  'Security',
  'Collaboration',
  'Business'
];

export default function FeaturedProducts() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter(
    product => selectedCategory === 'All' || product.category === selectedCategory
  );

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Featured Software
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Official licenses from leading software providers
          </p>
        </motion.div>

        <div className="flex items-center justify-center space-x-2 mb-8 overflow-x-auto pb-4">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <ProductGrid products={filteredProducts} loading={isLoading} />
      </div>
    </section>
  );
}