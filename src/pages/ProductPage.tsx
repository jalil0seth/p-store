import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, ChevronLeft, ChevronRight, Shield, Truck, Clock, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';
import { pb } from '../lib/pocketbase';
import ProductGrid from '../components/ProductGrid';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  stock: number;
  images: string[];
  category: string;
  rating: number;
  reviews: Review[];
  badge?: string;
  specifications?: { [key: string]: string };
  similarProducts?: string[];
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { products, fetchProducts, isLoading } = useProductStore();
  const [selectedTab, setSelectedTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Helper function to get product images
  const getProductImages = (product: Product): string[] => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return product.image ? [product.image] : [];
  };

  // Helper function to get product reviews
  const getProductReviews = (product: Product): Review[] => {
    if (product.reviewsList && product.reviewsList.length > 0) {
      return product.reviewsList;
    }
    // Return empty array if no reviews
    return [];
  };

  // Image slider controls
  const nextImage = () => {
    if (product) {
      const images = getProductImages(product);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      const images = getProductImages(product);
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Cancel any ongoing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();
        setError(null);
        
        await fetchProducts(abortControllerRef.current.signal);
      } catch (err) {
        if (err instanceof Error) {
          // Only set error if it's not a cancellation
          if (err.name !== 'AbortError') {
            console.error('Error loading products:', err);
            setError(err.message || 'Failed to load products');
          }
        }
      }
    };

    loadProducts();

    // Cleanup function to abort any ongoing request when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  // Find the product with matching slug
  const product = products.find(p => p.slug === slug);

  // If products are loaded but product not found, redirect to products page
  useEffect(() => {
    if (!isLoading && !product && products.length > 0) {
      console.log('Available slugs:', products.map(p => p.slug));
      console.log('Current slug:', slug);
      navigate('/products', { 
        replace: true, 
        state: { error: `Product "${slug}" not found` } 
      });
    }
  }, [isLoading, product, products, slug, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500">{error}</div>
          <Link 
            to="/products"
            className="inline-block text-primary-600 hover:text-primary-700"
          >
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500">Product not found</div>
          <Link 
            to="/products"
            className="inline-block text-primary-600 hover:text-primary-700"
          >
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  const productImages = getProductImages(product);
  const productReviews = getProductReviews(product);

  if (productImages.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500">Product images not available</div>
          <Link 
            to="/products"
            className="inline-block text-primary-600 hover:text-primary-700"
          >
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.images?.[0] || product.image,
        description: product.description,
        quantity: quantity
      });
    }
  };

  const similarProducts = products.filter(p => product.similarProducts?.includes(p.id));

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/products" 
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={productImages[currentImageIndex]}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              
              {product.badge && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-primary-500 text-white text-sm font-semibold rounded-full">
                  {product.badge}
                </div>
              )}

              {/* Image Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Preview */}
            {productImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-primary-500' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 text-sm font-medium text-primary-700 bg-primary-50 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-500">({product.reviews.length} reviews)</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-primary-600">${product.price}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                    <span className="text-lg font-semibold text-green-600">
                      Save {product.discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                  <Shield className="w-8 h-8 text-primary-500" />
                  <div>
                    <h4 className="font-semibold">Secure Payment</h4>
                    <p className="text-sm text-gray-600">100% secure checkout</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                  <Truck className="w-8 h-8 text-primary-500" />
                  <div>
                    <h4 className="font-semibold">Fast Delivery</h4>
                    <p className="text-sm text-gray-600">2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                  <Clock className="w-8 h-8 text-primary-500" />
                  <div>
                    <h4 className="font-semibold">24/7 Support</h4>
                    <p className="text-sm text-gray-600">Always here to help</p>
                  </div>
                </div>
              </div>

              {/* Stock Status */}
              {product.stock > 0 ? (
                <div className="text-green-600 font-medium mb-4">
                  In Stock ({product.stock} available)
                </div>
              ) : (
                <div className="text-red-600 font-medium mb-4">
                  Out of Stock
                </div>
              )}

              {/* Quantity Counter */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 px-6 text-lg font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                  product.stock > 0 
                    ? 'bg-primary-600 hover:bg-primary-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                {product.stock > 0 ? `Add ${quantity} to Cart - $${(product.price * quantity).toFixed(2)}` : 'Out of Stock'}
              </button>
            </div>

            {/* Tabs */}
            <div className="border-t pt-8">
              <div className="flex gap-8 mb-6">
                <button
                  onClick={() => setSelectedTab('description')}
                  className={`pb-2 font-medium transition-colors ${
                    selectedTab === 'description'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setSelectedTab('details')}
                  className={`pb-2 font-medium transition-colors ${
                    selectedTab === 'details'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  Details
                </button>
              </div>

              <AnimatePresence mode="wait">
                {selectedTab === 'description' ? (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="prose prose-lg max-w-none"
                  >
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-2">Product Details</h3>
                        <ul className="space-y-2 text-gray-600">
                          <li>Category: {product.category}</li>
                          <li>Stock: {product.stock} units</li>
                          <li>Rating: {product.rating} out of 5</li>
                          <li>Reviews: {product.reviews.length}</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Shipping Information</h3>
                        <ul className="space-y-2 text-gray-600">
                          <li>Free shipping on orders over $100</li>
                          <li>2-3 business days delivery</li>
                          <li>30-day return policy</li>
                          <li>Secure packaging</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {productReviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Review Summary */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold text-primary-600">{product.rating.toFixed(1)}</div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">Based on {product.reviews} reviews</div>
                  </div>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {productReviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-medium">{review.userName}</div>
                        <div className="text-sm text-gray-600">{new Date(review.date).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <button className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                        Helpful ({review.helpful})
                      </button>
                      <button className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                        Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <ProductGrid products={similarProducts} />
          </div>
        )}
      </div>
    </div>
  );
}