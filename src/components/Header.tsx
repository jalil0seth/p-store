import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Cart from './Cart';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const items = useCartStore((state) => state.items);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <Link 
              to="/" 
              className="text-xl font-bold tracking-tight hover:text-blue-600 transition-colors"
            >
              SoftwareStore
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/products" className="nav-link">All Software</Link>
              <Link to="/products?category=design" className="nav-link">Design</Link>
              <Link to="/products?category=engineering" className="nav-link">Engineering</Link>
              <Link to="/products?category=collaboration" className="nav-link">Collaboration</Link>
              
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

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
                    onClick={handleLogout}
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
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>

            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-xl font-bold">Menu</span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                  <div className="space-y-4">
                    <Link to="/products" className="block text-lg font-medium nav-link">
                      All Software
                    </Link>
                    <Link to="/products?category=design" className="block text-lg font-medium nav-link">
                      Design
                    </Link>
                    <Link to="/products?category=engineering" className="block text-lg font-medium nav-link">
                      Engineering
                    </Link>
                    <Link to="/products?category=collaboration" className="block text-lg font-medium nav-link">
                      Collaboration
                    </Link>
                  </div>

                  <div className="pt-6 border-t">
                    {isAuthenticated ? (
                      <>
                        <Link to="/dashboard" className="flex items-center space-x-2 mb-4 nav-link">
                          <User className="w-5 h-5" />
                          <span>{user?.name}</span>
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full btn btn-secondary"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link 
                        to="/signin" 
                        className="w-full btn btn-primary"
                      >
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t">
                <button
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full btn btn-primary flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>View Cart ({itemCount})</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 pt-20">
              <div className="bg-white rounded-xl shadow-xl p-4">
                <div className="flex items-center space-x-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search software..."
                    className="flex-1 border-none focus:ring-0 text-lg"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}