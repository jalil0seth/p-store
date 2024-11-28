import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin, logout: signOut } = useAuthStore();
  const { items, setIsOpen } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-900/90' : 'bg-transparent'
    }`}>
      <nav className="max-w-[80rem] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="text-xl font-bold tracking-tight hover:text-primary-500 transition-colors"
            >
              SoftwareStore
            </Link>

            <Link 
              to="/products" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Products
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {isAdmin ? 'Admin Area' : 'My Account'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-full transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}