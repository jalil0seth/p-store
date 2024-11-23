import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const COUNTRIES = [
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Norway', flag: '🇳🇴' },
  { name: 'Denmark', flag: '🇩🇰' },
  { name: 'Finland', flag: '🇫🇮' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Mexico', flag: '🇲🇽' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'UAE', flag: '🇦🇪' }
];

const PRODUCTS = [
  { name: 'Adobe Creative Cloud', price: 54.99 },
  { name: 'Microsoft 365', price: 69.99 },
  { name: 'AutoCAD 2024', price: 199.99 },
  { name: 'Sketch Pro', price: 99.99 },
  { name: 'Figma Enterprise', price: 149.99 }
];

interface SalesNotificationsProps {
  show: boolean;
}

export default function SalesNotifications({ show }: SalesNotificationsProps) {
  const randomCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const randomTime = Math.floor(Math.random() * 10) + 1;

  return (
    <motion.div
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      className="fixed md:bottom-24 left-4 top-20 md:top-auto z-50 max-w-sm"
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-primary-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 truncate">
            <span className="text-xl mr-2">{randomCountry.flag}</span>
            Someone from {randomCountry.name} just purchased
          </p>
          <p className="text-sm font-medium text-gray-900 truncate">
            {randomProduct.name}
          </p>
          <p className="text-xs text-gray-500">
            ${randomProduct.price} • {randomTime} minute{randomTime !== 1 ? 's' : ''} ago
          </p>
        </div>
      </div>
    </motion.div>
  );
}