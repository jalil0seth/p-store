import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';

const CHECKOUT_STEPS = [
  { id: 0, name: 'Cart' },
  { id: 1, name: 'Information' },
  { id: 2, name: 'Payment' }
];

export default function Cart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    total, 
    highlightedItemId,
    currentStep,
    setCurrentStep
  } = useCartStore();

  const parseImages = (imagesStr: string | string[]): string[] => {
    if (Array.isArray(imagesStr)) return imagesStr;
    try {
      const parsed = JSON.parse(imagesStr || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing images:', error);
      return [];
    }
  };

  const getImageUrl = (item: any): string => {
    const images = parseImages(item.images || '[]');
    return item.image || images[0] || 'https://placehold.co/100x100?text=No+Image';
  };

  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
    whatsapp: '',
    discountCode: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    name: '',
    whatsapp: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    paymentMethod: 'credit-card'
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateWhatsApp = (number: string) => {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(number);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate information step
      const newErrors = {
        email: '',
        name: '',
        whatsapp: ''
      };

      if (!customerInfo.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(customerInfo.email)) {
        newErrors.email = 'Invalid email format';
      }

      if (!customerInfo.name.trim()) {
        newErrors.name = 'Name is required';
      }

      // Only validate WhatsApp if a number is provided
      if (customerInfo.whatsapp && !validateWhatsApp(customerInfo.whatsapp)) {
        newErrors.whatsapp = 'Invalid WhatsApp number format';
      }

      setErrors(newErrors);

      if (Object.values(newErrors).some(error => error)) {
        return;
      }
    }

    if (currentStep < CHECKOUT_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Cart
        return (
          <div className="flex-1 overflow-y-auto px-4">
            {items.map((item) => {
              const savings = item.originalPrice && item.originalPrice > item.price 
                ? (item.originalPrice - item.price) * item.quantity
                : 0;
              
              return (
                <motion.div
                  key={`${item.id}-${item.variant?.name}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: highlightedItemId === item.id ? 1.02 : 1,
                    backgroundColor: highlightedItemId === item.id ? '#f3f4f6' : '#ffffff'
                  }}
                  className="relative py-4 border-b border-gray-100"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={getImageUrl(item)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/100x100?text=No+Image';
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <h3 className="text-base text-gray-900">{item.name}</h3>
                            <span className="text-gray-500">-</span>
                            {item.variant && (
                              <span className="text-gray-500">
                                {item.variant.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-md hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} className="text-gray-600" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-md hover:bg-gray-100 border border-gray-300"
                          >
                            <Plus size={16} className="text-gray-600" />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="flex flex-col items-end">
                            <div className="flex items-baseline gap-2">
                              {item.originalPrice && item.originalPrice > item.price && (
                                <div className="text-sm text-gray-500 line-through">
                                  ${(item.originalPrice * item.quantity).toFixed(2)}
                                </div>
                              )}
                              <div className="text-base text-primary-600">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                            {savings > 0 && (
                              <div className="text-sm text-green-600">
                                You save: ${savings.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

          </div>
        );

      case 1: // Information
        return (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => {
                  setCustomerInfo(prev => ({ ...prev, email: e.target.value }));
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => {
                  setCustomerInfo(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) {
                    setErrors(prev => ({ ...prev, name: '' }));
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={customerInfo.whatsapp}
                onChange={(e) => {
                  setCustomerInfo(prev => ({ ...prev, whatsapp: e.target.value }));
                  if (errors.whatsapp) {
                    setErrors(prev => ({ ...prev, whatsapp: '' }));
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.whatsapp ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1234567890"
              />
              {errors.whatsapp && (
                <p className="mt-1 text-sm text-red-500">{errors.whatsapp}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Code
              </label>
              <input
                type="text"
                value={customerInfo.discountCode}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, discountCode: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter code (optional)"
              />
            </div>
          </div>
        );

      case 2: // Payment
        return (
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="credit-card"
                  name="payment-method"
                  value="credit-card"
                  checked={paymentInfo.paymentMethod === 'credit-card'}
                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="text-primary-500 focus:ring-primary-500"
                />
                <label htmlFor="credit-card" className="text-sm font-medium text-gray-700">
                  Credit Card
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="paypal"
                  name="payment-method"
                  value="paypal"
                  checked={paymentInfo.paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="text-primary-500 focus:ring-primary-500"
                />
                <label htmlFor="paypal" className="text-sm font-medium text-gray-700">
                  PayPal
                </label>
              </div>
            </div>

            {paymentInfo.paymentMethod === 'credit-card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.expiry}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiry: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cvc}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvc: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    setCurrentStep(0);
  }, [items.length, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-xl z-[70]"
          >
            <div className="flex flex-col h-full">
              <div className="sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center">
                    {currentStep > 0 && (
                      <button
                        onClick={handleBack}
                        className="mr-4 p-2 hover:bg-gray-100 rounded-full"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    )}
                    <h2 className="text-xl font-bold">{CHECKOUT_STEPS[currentStep].name}</h2>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex px-4 pt-4">
                  {CHECKOUT_STEPS.map((step, index) => (
                    <div key={step.name} className="flex-1 flex items-center">
                      <div
                        className={`w-full h-2 rounded-full ${
                          index === 0 ? 'ml-0' : index === CHECKOUT_STEPS.length - 1 ? 'mr-0' : ''
                        } ${
                          index <= currentStep ? 'bg-primary-500' : 'bg-gray-200'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <CreditCard className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</p>
                    <p className="text-gray-500">Start shopping to add items to your cart</p>
                  </div>
                ) : (
                  renderStepContent()
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t px-4 py-4 space-y-3">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ${items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
                {items.some(item => item.originalPrice && item.originalPrice > item.price) && (
                  <div className="flex justify-between text-base text-green-600">
                    <span>Total Savings</span>
                    <span className="font-medium">
                      ${items.reduce((acc, item) => {
                        const itemSavings = item.originalPrice && item.originalPrice > item.price
                          ? (item.originalPrice - item.price) * item.quantity
                          : 0;
                        return acc + itemSavings;
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-primary-600">
                    ${items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
                <button 
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={items.length === 0}
                  onClick={handleNext}
                >
                  <span>
                    {currentStep === CHECKOUT_STEPS.length - 1 ? 'Complete Order' : 'Continue'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}