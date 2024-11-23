import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import ThemeToggle from './ThemeToggle';
import Cart from './Cart';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const items = useCartStore((state) => state.items);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const mainMenuItems = [
    { label: 'Browse Software', href: '/products' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Partners', href: '/partners' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Sales', href: '/contact' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Link 
            to="/" 
            className="text-xl font-bold tracking-tight hover:text-primary-500 transition-colors"
          >
            SoftwareStore
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {mainMenuItems.map((item) => (
              <Link 
                key={item.label}
                to={item.href} 
                className="nav-link"
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              <ThemeToggle />

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center space-x-2 nav-link"
                  >
                    <User className="w-5 h-5" />
                    <span>{user?.name}</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="btn btn-secondary"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  to="/signin" 
                  className="btn btn-primary"
                >
                  Sign In
                </Link>
              )}
              
              <button 
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <button 
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-4">
                {mainMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block nav-link py-2"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 pt-20">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4">
                <div className="flex items-center space-x-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search software..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-lg"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}