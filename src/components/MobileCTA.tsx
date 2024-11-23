import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';

interface MobileCTAProps {
  onOpenCart: () => void;
}

export default function MobileCTA({ onOpenCart }: MobileCTAProps) {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:hidden z-40"
    >
      <button 
        onClick={onOpenCart}
        className="w-full btn btn-primary py-3 space-x-2"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>View Cart ({itemCount})</span>
        {itemCount > 0 && (
          <span className="text-sm">
            Total: ${items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
          </span>
        )}
      </button>
    </motion.div>
  );
}