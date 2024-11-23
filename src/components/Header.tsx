import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Search, User, ChevronDown, Globe, CreditCard, Laptop, Paintbrush, Shield, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import ThemeToggle from './ThemeToggle';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

const CATEGORIES = [
  { name: 'Design', icon: Paintbrush, href: '/products?category=design' },
  { name: 'Development', icon: Laptop, href: '/products?category=development' },
  { name: 'Security', icon: Shield, href: '/products?category=security' },
  { name: 'Business', icon: Users, href: '/products?category=business' },
];

interface HeaderProps {
  onOpenCart: () => void;
}

export default function Header({ onOpenCart }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-[80rem] mx-auto">
        <nav className="h-16">
          <div className="flex items-center justify-between h-full px-4">
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
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.name}
                    to={category.href}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors"
                  >
                    <category.icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <span className="text-lg">{selectedLanguage.flag}</span>
              </button>

              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="p-2 hover:bg-gray-100 rounded-full hidden sm:flex"
              >
                <span>{selectedCurrency.symbol}</span>
              </button>

              {isAuthenticated ? (
                <div className="hidden lg:flex items-center gap-2">
                  <Link 
                    to="/dashboard" 
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
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t shadow-xl overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.name}
                    to={category.href}
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <category.icon className="w-5 h-5 text-primary-500" />
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setIsLanguageOpen(false);
                    }}
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      selectedLanguage.code === lang.code ? 'bg-primary-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {CURRENCIES.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      setSelectedCurrency(currency);
                      setIsCurrencyOpen(false);
                    }}
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      selectedCurrency.code === currency.code ? 'bg-primary-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span>{currency.symbol}</span>
                    <span>{currency.name}</span>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <User className="w-5 h-5" />
                      <span>{user?.name}</span>
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full p-3 text-center bg-gray-100 rounded-lg"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/signin" 
                    className="block w-full p-3 text-center bg-primary-500 text-white rounded-lg"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isLanguageOpen || isCurrencyOpen) && !isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 right-0 w-full sm:w-64 bg-white shadow-xl rounded-b-xl border-t overflow-hidden"
          >
            {isLanguageOpen && (
              <div className="p-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setIsLanguageOpen(false);
                    }}
                    className="flex items-center gap-2 w-full p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}

            {isCurrencyOpen && (
              <div className="p-2">
                {CURRENCIES.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      setSelectedCurrency(currency);
                      setIsCurrencyOpen(false);
                    }}
                    className="flex items-center gap-2 w-full p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <span>{currency.symbol}</span>
                    <span>{currency.name}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}