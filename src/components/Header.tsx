import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

interface HeaderProps {
  onOpenCart: () => void;
}

export default function Header({ onOpenCart }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const items = useCartStore((state) => state.items);
  const { isAuthenticated, user, isAdmin, logout } = useAuthStore();
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <nav className="max-w-[80rem] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <Link 
              to="/" 
              className="text-xl font-bold tracking-tight hover:text-primary-500 transition-colors"
            >
              SoftwareStore
            </Link>

            <div className="hidden lg:flex items-center gap-6 ml-8">
              <Link to="/products" className="nav-link">Products</Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  Manage Store
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link 
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden xl:inline">{user?.name}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="btn btn-secondary py-2"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                to="/signin" 
                className="hidden lg:flex btn btn-primary py-2"
              >
                Sign In
              </Link>
            )}

            <button 
              onClick={onOpenCart}
              className="relative p-2 hover:bg-gray-100 rounded-full"
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
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t shadow-xl overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <Link
                to="/products"
                className="block p-3 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="block p-3 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Manage Store
                </Link>
              )}

              {isAuthenticated ? (
                <div className="space-y-3 pt-4 border-t">
                  <Link 
                    to={isAdmin ? '/admin' : '/dashboard'}
                    className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>{user?.name}</span>
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full p-3 text-center bg-gray-100 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  to="/signin" 
                  className="block w-full p-3 text-center bg-primary-500 text-white rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}