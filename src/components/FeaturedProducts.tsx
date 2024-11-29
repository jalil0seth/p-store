import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProductStore } from '../store/productStore';
import ProductGrid from './ProductGrid';
import { Button } from './ui/button';

export default function FeaturedProducts() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { products, fetchProducts, isLoading } = useProductStore();
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get unique categories from available products only
  useEffect(() => {
    if (products.length > 0) {
      const availableProducts = products.filter(p => p.isAvailable === 1);
      const uniqueCategories = ['All', ...new Set(availableProducts.map(p => p.category))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  // Filter products based on category (only show available products)
  const filteredProducts = products
    .filter(product => product.isAvailable === 1)
    .filter(product => {
      if (selectedCategory === 'All') return true;
      const productCategory = product.category?.trim().toLowerCase();
      const selectedCat = selectedCategory.toLowerCase();
      return productCategory === selectedCat;
    });

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

        <div className="flex justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'ghost'}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-2 ${
                selectedCategory === category 
                ? 'bg-primary text-white hover:bg-primary/90' 
                : 'hover:bg-gray-100'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        <ProductGrid products={filteredProducts} loading={isLoading} />
      </div>
    </section>
  );
}