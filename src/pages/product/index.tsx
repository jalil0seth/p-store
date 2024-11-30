import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronUp, X, Star, ChevronRight, Check } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import { useCartStore } from '../../store/cartStore';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductReviews from './ProductReviews'; // Import ProductReviews component
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '../../utils/formatPrice';

interface ProductVariant {
  name: string;
  description: string;
  price: number;
  original_price?: number;
  billingCycle: 'monthly' | 'annual' | 'once';
  discountPercentage: number;
  features: string[];
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProduct, getProduct } = useProductStore();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const { addItem } = useCartStore();
  const [addedToCart, setAddedToCart] = useState(false);
  const [isVariantSheetOpen, setIsVariantSheetOpen] = useState(false);
  const [showMobileVariants, setShowMobileVariants] = useState(false);

  useEffect(() => {
    if (id) {
      getProduct(id);
    }
  }, [id, getProduct]);

  useEffect(() => {
    if (selectedProduct?.variants) {
      const variants = Array.isArray(selectedProduct.variants)
        ? selectedProduct.variants
        : JSON.parse(selectedProduct.variants);
      if (variants.length > 0) {
        const minPriceVariant = variants.reduce((min, current) => 
          current.price < min.price ? current : min
        , variants[0]);
        setSelectedVariant(minPriceVariant);
      }
    }
  }, [selectedProduct]);

  if (!selectedProduct) {
    return null;
  }

  const handleAddToCart = () => {
    if (selectedVariant) {
      const itemToAdd = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedVariant.price,
        originalPrice: selectedVariant.original_price || selectedVariant.price,
        image: selectedProduct.image,
        description: selectedProduct.description,
        variant: {
          name: selectedVariant.name,
          price: selectedVariant.price,
          discountPercentage: selectedVariant.discountPercentage,
          billingCycle: selectedVariant.billingCycle
        }
      };
      
      addItem(itemToAdd);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      setIsVariantSheetOpen(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedProduct.name,
          text: selectedProduct.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  // Handle images data structure
  const productImages = (() => {
    try {
      // If images is a string, try to parse it
      if (typeof selectedProduct.images === 'string') {
        return JSON.parse(selectedProduct.images);
      }
      // If images is already an array, use it
      if (Array.isArray(selectedProduct.images)) {
        return selectedProduct.images;
      }
      // If there's a single image property, create an array with it
      if (selectedProduct.image) {
        return [selectedProduct.image];
      }
      // Fallback to empty array
      return [];
    } catch (error) {
      console.error('Error parsing images:', error);
      return selectedProduct.image ? [selectedProduct.image] : [];
    }
  })();

  const variants = Array.isArray(selectedProduct.variants)
    ? selectedProduct.variants
    : JSON.parse(selectedProduct.variants || '[]');

  const metadata = {
    sku: selectedProduct.sku,
    category: selectedProduct.category,
    tags: selectedProduct.tags,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-white border-b md:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-lg font-medium text-gray-900 truncate max-w-[200px]">
            {selectedProduct.name}
          </h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Desktop Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="hidden md:flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Gallery */}
          <div className="relative -mx-4 px-4 md:mx-0 md:px-0 md:sticky md:top-8">
            <ProductGallery
              image={selectedProduct.image}
              images={selectedProduct.images}
              productName={selectedProduct.name}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:pl-8 pb-32 md:pb-0">
            <ProductInfo
              name={selectedProduct.name}
              description={selectedProduct.description || ''}
              price={selectedProduct.price || 0}
              originalPrice={selectedProduct.originalPrice}
              rating={selectedProduct.rating}
              reviews={selectedProduct.reviews}
              category={selectedProduct.category}
              variants={variants}
              selectedVariant={selectedVariant}
              onVariantSelect={setSelectedVariant}
              metadata={metadata}
              hideVariants={true}
              onAddToCart={handleAddToCart}
              onShare={handleShare}
              addedToCart={addedToCart}
            />
          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="mt-16 bg-gray-50">
        <ProductReviews
          overallRating={4.7}
          totalReviews={128}
          ratingBreakdown={{
            5: 89,
            4: 24,
            3: 10,
            2: 3,
            1: 2,
          }}
        />
      </div>

      {/* Mobile Bottom Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 z-20 w-full border-t bg-white px-4 py-3 lg:hidden safe-area-bottom"
      >
        <div className="mx-auto flex max-w-md flex-col space-y-2">

          {/* Price and Variant Selection */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(selectedVariant?.price || 0)}
                  </span>
                  {selectedVariant?.original_price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(selectedVariant.original_price)}
                    </span>
                  )}
                </div>
                {variants.length > 1 && (
                  <div className="mt-1 text-sm text-gray-500">
                    {selectedVariant?.name}
                  </div>
                )}
              </div>
              {variants.length > 1 && (
                <motion.button
                  onClick={() => setShowMobileVariants(true)}
                  className="flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Change Plan
                </motion.button>
              )}
            </div>
            <motion.button
              onClick={() => handleAddToCart(selectedVariant)}
              className={`flex w-full items-center justify-center rounded-lg px-6 py-3 text-base font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                addedToCart
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {addedToCart ? 'Added!' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Variants Sheet */}
      {variants.length > 1 && (
        <AnimatePresence>
          {showMobileVariants && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-30"
                onClick={() => setShowMobileVariants(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-30 safe-area-bottom"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Select Plan</h3>
                      <p className="text-sm text-gray-500">Choose the plan that works best for you</p>
                    </div>
                    <motion.button
                      onClick={() => setShowMobileVariants(false)}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {variants.map((variant, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setShowMobileVariants(false);
                        }}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                          selectedVariant?.name === variant.name
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-medium text-gray-900">{variant.name}</span>
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-primary-600">
                              {formatPrice(variant.price)}
                              {variant.billingCycle !== 'once' &&
                                `/${variant.billingCycle === 'monthly' ? 'mo' : 'yr'}`}
                            </span>
                            {variant.original_price && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(variant.original_price)}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{variant.description}</p>
                        {variant.features && variant.features.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {variant.features.map((feature, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                <Check className="w-4 h-4 text-primary-600" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
