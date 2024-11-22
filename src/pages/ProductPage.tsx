import React from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Shield, Award, Clock } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function ProductPage() {
  const { id } = useParams();
  const addItem = useCartStore((state) => state.addItem);

  // In a real app, fetch product data based on ID
  const product = {
    id: id || 'adobe-cc',
    name: 'Adobe Creative Cloud',
    description: 'Complete collection of 20+ creative desktop and mobile apps including Photoshop, Illustrator, InDesign, Premiere Pro, and more.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=1200&h=600',
    features: [
      'Access to all Creative Cloud apps',
      '100GB of cloud storage',
      'Adobe Fonts',
      'Adobe Portfolio',
      'Premium features and services',
    ],
    specs: {
      'System Requirements': ['Windows 10 or macOS Catalina', '8GB RAM minimum', 'GPU with DirectX 12 support'],
      'License Type': ['Subscription-based', 'Monthly or annual billing', 'Cancellation available'],
      'Support': ['24/7 technical support', 'Online tutorials', 'Community forums'],
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-xl shadow-lg"
              />
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <span className="text-sm text-gray-600">Official License</span>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Award className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <span className="text-sm text-gray-600">Premium Support</span>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <span className="text-sm text-gray-600">Instant Delivery</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-bold">${product.price}/mo</span>
                  <button
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price })}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Features</h2>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Specifications</h2>
                {Object.entries(product.specs).map(([category, items]) => (
                  <div key={category} className="mb-6 last:mb-0">
                    <h3 className="font-medium mb-2">{category}</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}