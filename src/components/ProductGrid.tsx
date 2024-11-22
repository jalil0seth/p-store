import React from 'react';
import { ArrowRight, ShoppingCart } from 'lucide-react';
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
      category: 'Design'
    },
    {
      id: 'autocad-2024',
      name: 'AutoCAD 2024',
      description: '2D and 3D CAD design, drafting, modeling, architectural drawing',
      image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&h=400',
      price: 219.99,
      category: 'Engineering'
    },
    {
      id: 'miro-enterprise',
      name: 'Miro Enterprise',
      description: 'Online collaborative whiteboard platform for teams',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&h=400',
      price: 16.99,
      category: 'Collaboration'
    },
    {
      id: 'figma-pro',
      name: 'Figma Professional',
      description: 'Collaborative interface design tool',
      image: 'https://images.unsplash.com/photo-1613791049514-61f092547240?auto=format&fit=crop&w=800&h=400',
      price: 15.99,
      category: 'Design'
    },
    {
      id: 'sketch-pro',
      name: 'Sketch Professional',
      description: 'Vector graphics editor for macOS',
      image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&h=400',
      price: 99.99,
      category: 'Design'
    },
    {
      id: 'unity-pro',
      name: 'Unity Pro',
      description: 'Real-time 3D development platform',
      image: 'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?auto=format&fit=crop&w=800&h=400',
      price: 199.99,
      category: 'Development'
    }
  ];

  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Software
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Official licenses from leading software providers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product) => (
            <div 
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-500 transition-all hover:shadow-lg"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full mb-2">
                      {product.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      {product.name}
                    </h3>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">
                  {product.description}
                </p>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price })}
                    className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                  <a 
                    href={`/product/${product.id}`}
                    className="flex items-center justify-center p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}