import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function ProductGrid() {
  const addItem = useCartStore((state) => state.addItem);

  const products = [
    {
      id: 'adobe-cc',
      name: 'Adobe Creative Cloud',
      description: 'Complete collection of 20+ creative desktop and mobile apps',
      image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=800&h=400',
      price: 54.99,
      category: 'Design',
      rating: 4.9,
      reviews: 2547
    },
    {
      id: 'autocad-2024',
      name: 'AutoCAD 2024',
      description: '2D and 3D CAD design, drafting, modeling, architectural drawing',
      image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&h=400',
      price: 219.99,
      category: 'Engineering',
      rating: 4.8,
      reviews: 1823
    },
    {
      id: 'miro-enterprise',
      name: 'Miro Enterprise',
      description: 'Online collaborative whiteboard platform for teams',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&h=400',
      price: 16.99,
      category: 'Collaboration',
      rating: 4.7,
      reviews: 3102
    }
  ];

  return (
    <section id="products" className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Featured Software</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Official licenses from leading software providers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group card overflow-hidden hover:scale-[1.02] transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-2">
                      {product.category}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </div>
                    <div className="text-sm text-gray-500">/month</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-gray-500">({product.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price })}
                    className="btn btn-primary flex-1"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </button>
                  <a
                    href={`/product/${product.id}`}
                    className="btn btn-secondary p-3"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}