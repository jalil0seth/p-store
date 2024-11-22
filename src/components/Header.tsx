import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import Cart from './Cart';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const items = useCartStore((state) => state.items);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-xl font-bold">SoftwareStore</a>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#products" className="text-gray-600 hover:text-gray-900">All Software</a>
              <a href="#design" className="text-gray-600 hover:text-gray-900">Design</a>
              <a href="#engineering" className="text-gray-600 hover:text-gray-900">Engineering</a>
              <a href="#collaboration" className="text-gray-600 hover:text-gray-900">Collaboration</a>
              <button 
                className="flex items-center space-x-2"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg">
              <div className="flex flex-col space-y-4 p-4">
                <a href="#products" className="text-gray-600 hover:text-gray-900">All Software</a>
                <a href="#design" className="text-gray-600 hover:text-gray-900">Design</a>
                <a href="#engineering" className="text-gray-600 hover:text-gray-900">Engineering</a>
                <a href="#collaboration" className="text-gray-600 hover:text-gray-900">Collaboration</a>
                <button 
                  className="flex items-center space-x-2"
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart ({itemCount})</span>
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}