import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import ProductCard from '../components/ProductCard';
import { pb, isAdmin } from '../lib/pocketbase';

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
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    setIsAdminUser(isAdmin());
  }, []);

  // Get unique categories from available products
  useEffect(() => {
    if (products.length > 0) {
      const availableProducts = products.filter(p => p.isAvailable === 1);
      const uniqueCategories = ['All', ...new Set(availableProducts.map(p => p.category))];
      setCategories(uniqueCategories);
    }
  }, [products]);

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

  const filteredProducts = products
    .filter(product => product.isAvailable === 1)
    .filter(product => {
      if (selectedCategory === 'All') return true;
      const productCategory = product.category?.trim().toLowerCase();
      const selectedCat = selectedCategory.toLowerCase();
      return productCategory === selectedCat;
    })
    .filter(product => 
      searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
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
      <div className="min-h-screen pt-5 pb-16 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8 pt-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <span>Home</span>
              <ChevronRight className="w-4 h-4" />
              <span>Products</span>
              {selectedCategory !== 'All' && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span>{selectedCategory}</span>
                </>
              )}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Discover our curated collection of high-quality products designed to enhance your experience.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4">
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

                {/* Sort */}
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

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
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

          {/* Products Grid */}
          <div className="bg-light rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}