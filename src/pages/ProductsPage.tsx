import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import ProductGrid from '../components/ProductGrid';
import { pb, isAdmin } from '../lib/pocketbase';

const CATEGORIES = [
  'All',
  'Design',
  'Development',
  'Business',
  'Security',
  'Collaboration'
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' }
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const { products, fetchProducts, loading } = useProductStore();
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    setIsAdminUser(isAdmin());
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts();
      } finally {
        // setLoading(false);
      }
    };
    loadProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = products.filter(product => 
    (selectedCategory === 'All' || product.category === selectedCategory) &&
    (searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default: // 'popular'
        return b.reviews - a.reviews;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">All Products</h1>
            
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative w-[200px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ProductGrid products={filteredProducts} loading={loading} />
      </div>
    </div>
  );
}