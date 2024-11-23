import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Search, ArrowRight, ShoppingCart, Star, Tag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const PRODUCTS = [
  {
    id: 'adobe-cc',
    name: 'Adobe Creative Cloud',
    description: 'Complete collection of 20+ creative desktop and mobile apps',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/12/372690413/AN/EO/SN/3538534/adobe-creative-cloud-software-2023-500x500.jpg',
    price: 54.99,
    originalPrice: 79.99,
    discount: 30,
    category: 'Design',
    rating: 4.9,
    reviews: 2547,
    badge: 'Best Seller'
  },
  {
    id: 'autocad-2024',
    name: 'AutoCAD 2024',
    description: '2D and 3D CAD design, drafting, modeling, architectural drawing',
    image: 'https://i.etsystatic.com/26517593/r/il/0948ca/6340830501/il_794xN.6340830501_glkw.jpg',
    price: 219.99,
    originalPrice: 299.99,
    discount: 25,
    category: 'Design',
    rating: 4.8,
    reviews: 1823,
    badge: 'Popular'
  },
  {
    id: 'miro-enterprise',
    name: 'Miro Enterprise',
    description: 'Online collaborative whiteboard platform for teams',
    image: 'https://res.cloudinary.com/tektoniclabs/image/upload/v1695198556/caudit/Miro_Logo_2023_400x250_3e9e2c61f2.png',
    price: 16.99,
    originalPrice: 24.99,
    discount: 40,
    category: 'Collaboration',
    rating: 4.7,
    reviews: 3102,
    badge: 'Hot Deal'
  },
  {
    id: 'visual-studio',
    name: 'Visual Studio Enterprise',
    description: 'Professional IDE for software development',
    image: 'https://au.softvire.com/wp-content/uploads/sites/17/2023/06/Visual-Studio-Enterprise-Standard-Subscription-Box.jpg',
    price: 45.99,
    originalPrice: 69.99,
    discount: 35,
    category: 'Development',
    rating: 4.9,
    reviews: 1890,
    badge: 'Trending'
  },
  {
    id: 'kaspersky-total',
    name: 'Kaspersky Total Security',
    description: 'Complete protection for your digital life',
    image: 'https://www.sngf.ma/115/kaspersky-antivirus-2020-3-postes-1-an.jpg',
    price: 29.99,
    originalPrice: 49.99,
    discount: 40,
    category: 'Security',
    rating: 4.8,
    reviews: 2156,
    badge: 'Best Value'
  },
  {
    id: 'office-365',
    name: 'Microsoft 365 Business',
    description: 'Complete suite of productivity tools',
    image: 'https://joutech.ma/3537-large_default/microsoft-office-365-business-standard-retail-francais.jpg',
    price: 12.99,
    originalPrice: 19.99,
    discount: 35,
    category: 'Business',
    rating: 4.9,
    reviews: 3567,
    badge: 'Most Popular'
  },
  {
    id: 'linkedin-recruiter',
    name: 'LinkedIn Recruiter',
    description: 'Professional recruiting and hiring platform',
    image: 'https://blog.waalaxy.com/wp-content/uploads/2021/01/7.svg',
    price: 89.99,
    originalPrice: 129.99,
    discount: 30,
    category: 'Business',
    rating: 4.7,
    reviews: 1234,
    badge: 'Enterprise'
  },
  {
    id: 'figma-org',
    name: 'Figma Organization',
    description: 'Professional design platform for teams',
    image: 'https://img.uxcel.com/tags/figma-1698087967030-2x.jpg',
    price: 39.99,
    originalPrice: 59.99,
    discount: 35,
    category: 'Design',
    rating: 4.9,
    reviews: 2890,
    badge: 'Team Choice'
  }
];

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
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  const itemsPerPage = 8;

  const filteredProducts = PRODUCTS.filter(product => 
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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-[80rem] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Browse Software
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Find the perfect software solution for your needs
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search software..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="relative">
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    {product.badge && (
                      <span className="px-3 py-1 text-xs font-semibold text-white bg-primary-500 rounded-full">
                        {product.badge}
                      </span>
                    )}
                    <span className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
                      Save {product.discount}%
                    </span>
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">{product.category}</span>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      <span className="text-sm text-gray-500">/mo</span>
                      <div className="text-sm">
                        <span className="text-gray-500 line-through">${product.originalPrice}</span>
                        <span className="text-green-600 ml-2">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
                      </div>
                    </div>
                    <Tag className="w-5 h-5 text-primary-500" />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => addItem(product)}
                      className="col-span-3 btn btn-primary"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <a
                      href={`/product/${product.id}`}
                      className="btn btn-secondary p-3"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === index + 1
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}