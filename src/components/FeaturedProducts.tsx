import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Star, Tag, Filter } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const CATEGORIES = [
  'All',
  'Design',
  'Development',
  'Security',
  'Collaboration',
  'Business'
];

const FEATURED_PRODUCTS = [
  {
    id: 'adobe-cc',
    name: 'Adobe Creative Cloud',
    description: 'Complete collection of 20+ creative desktop and mobile apps',
    image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=800&h=400',
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
    image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&h=400',
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
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&h=400',
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
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&h=400',
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
    image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=800&h=400',
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
    image: 'https://images.unsplash.com/photo-1583321500900-82807e458f3c?auto=format&fit=crop&w=800&h=400',
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
    image: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?auto=format&fit=crop&w=800&h=400',
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
    image: 'https://images.unsplash.com/photo-1613791049514-61f092cd6482?auto=format&fit=crop&w=800&h=400',
    price: 39.99,
    originalPrice: 59.99,
    discount: 35,
    category: 'Design',
    rating: 4.9,
    reviews: 2890,
    badge: 'Team Choice'
  }
];

export default function FeaturedProducts() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const addItem = useCartStore((state) => state.addItem);

  const filteredProducts = FEATURED_PRODUCTS.filter(
    product => selectedCategory === 'All' || product.category === selectedCategory
  );

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Featured Software Deals
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Limited time offers on premium software
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-12">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500"
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
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              </div>
              
              <div className="p-6">
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
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price })}
                    className="col-span-3 btn btn-primary"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className="btn btn-secondary p-3"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}