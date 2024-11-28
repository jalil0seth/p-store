import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Tag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

interface ProductVariant {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  billingCycle: 'monthly' | 'annual' | 'once';
  discountPercentage: number;
  features: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image?: string;
  images?: string[];
  category?: string;
  rating?: number;
  reviews?: number;
  slug?: string;
  variants?: ProductVariant[];
  metadata?: {
    shortDescription: string;
    longDescription: string;
    features: string[];
    specifications: string[];
    compatibility: string[];
    valuePropositions: string[];
    commonUses: string[];
    advantages: string[];
    whyBuy: string[];
    mainBenefits: string[];
    targetAudience: string[];
  };
}

interface ProductCardProps {
  product: Product;
  layout?: boolean;
}

const getLowestPrice = (variants: ProductVariant[] = []): number => {
  if (!variants || variants.length === 0) return 0;
  return Math.min(...variants.map(v => v.price));
};

export default function ProductCard({ product, layout = true }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.images?.[0] || product.image,
      description: product.description
    });
  };

  const variants = typeof product.variants === 'string' 
    ? JSON.parse(product.variants) 
    : (product.variants || []);

  const metadata = typeof product.metadata === 'string'
    ? JSON.parse(product.metadata)
    : (product.metadata || {
        shortDescription: '',
        features: [],
        specifications: [],
        compatibility: [],
        valuePropositions: [],
        commonUses: [],
        advantages: [],
        whyBuy: [],
        mainBenefits: [],
        targetAudience: []
      });

  const lowestPrice = getLowestPrice(variants);

  const imageUrl = product.images?.[0] || product.image || '/placeholder-product.jpg';
  const finalPrice = product.discount 
    ? product.price * (1 - (product.discount / 100))
    : product.price;
  const savings = product.originalPrice 
    ? product.originalPrice - finalPrice
    : product.discount 
      ? product.price * (product.discount / 100)
      : 0;

  const shortDescription = metadata.shortDescription || product.description;
  const mainFeature = metadata.valuePropositions?.[0] || metadata.mainBenefits?.[0] || '';

  return (
    <motion.div
      layout={layout}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.jpg';
            }}
          />
          {product.discount && product.discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              {product.discount}% OFF
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          
          {shortDescription && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {shortDescription}
            </p>
          )}

          {mainFeature && (
            <p className="mt-2 text-sm text-green-600 font-medium">
              {mainFeature}
            </p>
          )}

          <div className="mt-2 flex items-center space-x-2">
            {product.rating && (
              <div className="flex items-center text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
              </div>
            )}
            {product.reviews && (
              <span className="text-sm text-gray-500">
                ({product.reviews} reviews)
              </span>
            )}
          </div>

          <div className="mt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-gray-900">
                {lowestPrice > 0 ? `From $${lowestPrice.toFixed(2)}` : `$${finalPrice.toFixed(2)}`}
              </span>
              {(product.originalPrice || product.discount) && (
                <span className="text-sm text-gray-500 line-through">
                  ${(product.originalPrice || product.price).toFixed(2)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <div className="text-sm text-green-600 font-medium">
                Save ${savings.toFixed(2)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-4 w-full flex items-center justify-center space-x-2 btn btn-primary py-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
