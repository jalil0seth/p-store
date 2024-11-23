import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Search, User, ChevronDown } from 'lucide-react';
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
    { 
      label: 'Products', 
      href: '/products',
      submenu: [
        { label: 'Design Software', href: '/products?category=design' },
        { label: 'Development Tools', href: '/products?category=development' },
        { label: 'Security Solutions', href: '/products?category=security' },
        { label: 'Business Apps', href: '/products?category=business' }
      ]
    },
    { 
      label: 'Solutions',
      href: '/solutions',
      submenu: [
        { label: 'For Enterprise', href: '/solutions/enterprise' },
        { label: 'For Startups', href: '/solutions/startups' },
        { label: 'For Education', href: '/solutions/education' }
      ]
    },
    { label: 'Partners', href: '/partners' },
    { label: 'Pricing', href: '/pricing' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container-width mx-auto">
        <nav className="h-16">
          <div className="flex items-center justify-between h-full">
            <Link 
              to="/" 
              className="text-xl font-bold tracking-tight hover:text-primary-500 transition-colors"
            >
              SoftwareStore
            </Link>
            
            <div className="hidden lg:flex items-center space-x-8">
              {mainMenuItems.map((item) => (
                <div key={item.label} className="relative group">
                  <Link 
                    to={item.href}
                    className="flex items-center gap-1 nav-link py-2"
                  >
                    {item.label}
                    {item.submenu && <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />}
                  </Link>
                  
                  {item.submenu && (
                    <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 min-w-[200px]">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.label}
                            to={subitem.href}
                            className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg transition-colors"
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-4">
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

            <button 
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          >
            <div className="container-width mx-auto px-4 pt-20">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search software, categories, or brands..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-transparent focus:border-primary-500 focus:ring-0 transition-colors"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Popular Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Adobe Creative Cloud', 'Microsoft 365', 'AutoCAD', 'Antivirus'].map((term) => (
                      <button
                        key={term}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-x-0 top-16 bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-xl"
          >
            <div className="container-width mx-auto p-4">
              <div className="space-y-6">
                {mainMenuItems.map((item) => (
                  <div key={item.label}>
                    <Link
                      to={item.href}
                      className="block text-lg font-medium text-gray-900 dark:text-white mb-2"
                    >
                      {item.label}
                    </Link>
                    {item.submenu && (
                      <div className="ml-4 space-y-2">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.label}
                            to={subitem.href}
                            className="block text-gray-600 dark:text-gray-400"
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}