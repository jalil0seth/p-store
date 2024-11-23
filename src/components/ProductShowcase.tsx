import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function ProductShowcase() {
  const addItem = useCartStore((state) => state.addItem);

  const products = [
    {
      id: 'adobe-cc',
      name: 'Adobe Creative Cloud',
      description: 'Complete collection of 20+ creative desktop and mobile apps',
      image: 'https://phototrend.fr/wp-content/uploads/2024/05/offre-adobe-creative-cloud-mai-2024-770x384.jpg',
      price: 54.99,
      rating: 4.9,
      reviews: 2547
    },
    {
      id: 'autocad-2024',
      name: 'AutoCAD 2024',
      description: '2D and 3D CAD design, drafting, modeling, architectural drawing',
      image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&h=400',
      price: 219.99,
      rating: 4.8,
      reviews: 1823
    },
    {
      id: 'miro-enterprise',
      name: 'Miro Enterprise',
      description: 'Online collaborative whiteboard platform for teams',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&h=400',
      price: 16.99,
      rating: 4.7,
      reviews: 3102
    }
  ];

  return (
    <section id="products" className="py-20">
      <div className="max-w-[80rem] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Featured Software
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Official licenses from leading software providers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">{product.reviews} reviews</span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 mb-6">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      ${product.price}
                      <span className="text-sm font-normal text-gray-600">/mo</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => addItem(product)}
                        className="btn btn-primary flex items-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}