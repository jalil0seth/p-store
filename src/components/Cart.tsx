import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import { useNavigate } from 'react-router-dom';
import { pb } from '../lib/pocketbase';

const CHECKOUT_STEPS = [
  { id: 0, name: 'Cart' },
  { id: 1, name: 'Information' },
  { id: 2, name: 'Payment' }
];

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const navigate = useNavigate();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart,
    highlightedItemId,
    userInfo,
    setUserInfo
  } = useCartStore();
  const { createOrder, updateOrder } = useOrderStore();

  const [abandonedOrderId, setAbandonedOrderId] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    paymentMethod: 'credit-card'
  });

  const [customerInfo, setCustomerInfo] = useState({
    email: localStorage.getItem('customer_email') || '',
    name: '',
    whatsapp: '',
    discountCode: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    name: '',
    whatsapp: ''
  });

  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

  const [currentStep, setCurrentStep] = useState(0);

  const [deviceHash, setDeviceHash] = useState(() => {
    // Get existing device hash or create new one
    const existingHash = localStorage.getItem('device_hash');
    if (existingHash) return existingHash;
    
    const newHash = `DEV-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('device_hash', newHash);
    return newHash;
  });

  const [cartRef, setCartRef] = useState(() => {
    // Get existing cart ref or create new one
    const existingRef = localStorage.getItem('cart_ref');
    if (existingRef) return existingRef;
    
    const newRef = `CART-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('cart_ref', newRef);
    return newRef;
  });

  useEffect(() => {
    // Initialize device hash from cookie or create new one
    // let hash = localStorage.getItem('device_hash');
    // if (!hash) {
    //   hash = `DEV-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    //   localStorage.setItem('device_hash', hash);
    // }
    // setDeviceHash(hash);

    // Initialize cart reference from cookie or create new one
    // let ref = localStorage.getItem('cart_ref');
    // if (!ref) {
    //   ref = `CART-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    //   localStorage.setItem('cart_ref', ref);
    // }
    // setCartRef(ref);
  }, []);

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

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateWhatsApp = (number: string) => {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(number);
  };

  // Create abandoned order as soon as email is available
  useEffect(() => {
    if (customerInfo.email && validateEmail(customerInfo.email)) {
      createOrUpdateAbandonedOrder();
    }
  }, [customerInfo.email, items]);

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      return sum + itemTotal;
    }, 0);
  };

  const cartTotal = calculateTotal();

  const createOrUpdateAbandonedOrder = async () => {
    try {
      // Only create/update order if we have at least the email
      if (!customerInfo.email || !validateEmail(customerInfo.email)) {
        return;
      }

      // Ensure we have items in the cart
      if (!items.length) {
        return;
      }

      // Format items to only include required fields
      const formattedItems = items.map(item => ({
        id: item.id,
        name: item.name,
        variant: {
          id: item.variant?.id || '',
          name: item.variant?.name || ''
        },
        price: Number(item.price),
        originalPrice: Number(item.originalPrice || item.price),
        quantity: Number(item.quantity)
      }));

      console.log('Formatted items:', formattedItems);

      const orderData = {
        items: formattedItems,
        info: customerInfo.email ? {
          email: customerInfo.email,
          name: customerInfo.name || 'Guest User',
          whatsapp: customerInfo.whatsapp || '',
          discountCode: customerInfo.discountCode || ''
        } : null,
        customer_email: customerInfo.email,
        subtotal: Number(cartTotal.toFixed(2)),
        total: Number(cartTotal.toFixed(2)),
        customer_device_hash: deviceHash,
        cart_ref: cartRef,
        payment_status: 'abandoned'
      };

      try {
        console.log('Creating/updating order with data:', orderData);
        const response = await fetch('http://localhost:8090/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Server error:', error);
          throw new Error(error.message || 'Failed to handle order');
        }

        const result = await response.json();
        console.log('Order handled:', result);
        setAbandonedOrderId(result.id);
        
        // Save email to localStorage for convenience
        localStorage.setItem('customer_email', customerInfo.email);
      } catch (error: any) {
        console.error('Error handling order:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error saving abandoned order:', error);
    }
  };

  const handleNext = async () => {
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

      // WhatsApp is optional, only validate if provided
      if (customerInfo.whatsapp && !validateWhatsApp(customerInfo.whatsapp)) {
        newErrors.whatsapp = 'Invalid WhatsApp number format';
      }

      setErrors(newErrors);

      if (Object.values(newErrors).filter(error => error).length > 0) {
        return;
      }

      // Update abandoned order with complete customer info
      await createOrUpdateAbandonedOrder();
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

  const handleCustomerInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors = {
      email: !customerInfo.email ? 'Email is required' : '',
      name: !customerInfo.name ? 'Name is required' : '',
      whatsapp: !customerInfo.whatsapp ? 'WhatsApp is required' : ''
    };

    if (Object.values(newErrors).some(error => error)) {
      setErrors(newErrors);
      return;
    }

    // Update abandoned order with complete customer info
    await createOrUpdateAbandonedOrder();
    setCurrentStep(2); // Move to payment step
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const orderTotal = cartTotal;
      const response = await fetch('http://localhost:8090/api/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: orderTotal.toFixed(2),
          email: customerInfo.email,
          items: items,
          orderRef: abandonedOrderId || `ORD-${Date.now()}`
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Invoice creation failed');
      }

      // Open PayPal invoice URL in a new window
      window.open(data.url, '_blank');

      // Start polling for invoice status
      let intervalId: NodeJS.Timeout;
      let timeoutId: NodeJS.Timeout;

      const checkStatus = async () => {
        try {
          const statusResponse = await fetch(`http://localhost:8090/api/invoice-status/${data.id}`);
          const statusData = await statusResponse.json();
          
          if (statusData.status === 'paid') {
            // Update abandoned order status if it exists
            if (abandonedOrderId) {
              await updateOrder(abandonedOrderId, {
                payment_status: 'completed' as const,
                delivery_status: 'pending' as const,
                payment_details: JSON.stringify({
                  invoice_id: data.id,
                  payment_method: 'paypal',
                  payment_date: new Date().toISOString(),
                  amount_paid: orderTotal
                })
              });
            }
            
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            setIsProcessingPayment(false);
            clearCart();
            onClose();
            navigate('/thank-you');
          }
        } catch (error) {
          console.error('Error checking invoice status:', error);
        }
      };

      // Poll every 3 seconds
      intervalId = setInterval(checkStatus, 3000);

      // Stop polling after 10 minutes
      timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        setIsProcessingPayment(false);
        alert('Payment session timed out. Please try again.');
      }, 10 * 60 * 1000);

    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to create invoice. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const renderCartStep = () => {
    const originalTotal = items.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
    const savings = originalTotal - cartTotal;
    const orderTotal = cartTotal;

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
  };

  const renderInformationStep = () => {
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
            WhatsApp Number (Optional)
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
            Discount Code (Optional)
          </label>
          <input
            type="text"
            value={customerInfo.discountCode}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, discountCode: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Enter code"
          />
        </div>
      </div>
    );
  };

  const renderPaymentStep = () => {
    const hasLowStock = items.some(item => item.quantity <= 3); // Assuming we have stock info
    
    return (
      <div className="flex-1 overflow-y-auto px-4">
        {isProcessingPayment ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-6"></div>
            <div className="text-center space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Processing Payment</h3>
              <div className="text-2xl font-mono font-medium text-primary-600">
                {formatTime(countdown)}
              </div>
              <p className="text-gray-600">
                Please complete your payment in the PayPal window.<br />
                Do not close this window until payment is complete.
              </p>
              {showTimeoutMessage && (
                <div className="mt-6 p-4 bg-amber-50 text-amber-700 rounded-lg">
                  <p className="text-sm">
                    Taking longer than expected? Make sure you've completed the payment in the PayPal window. 
                    If you're experiencing issues, please try refreshing the page or contact support.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="w-full max-w-md space-y-6">
              {/* Urgency Messages */}
              <div className="space-y-3">
                {hasLowStock && (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Limited stock available - Complete your order soon!</span>
                  </div>
                )}
                
                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-green-800">What you'll get:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Instant access after payment
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Secure payment via PayPal
                    </li>
                    {items.reduce((acc, item) => acc + ((item.originalPrice || item.price) - item.price) * item.quantity, 0) > 0 && (
                      <li className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Save ${items.reduce((acc, item) => acc + ((item.originalPrice || item.price) - item.price) * item.quantity, 0).toFixed(2)} today!
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* PayPal Button */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-center mb-3">
                  <img src="/payment-logos/paypal.svg" alt="PayPal" className="h-5 sm:h-6" />
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-[#0070ba] text-white py-3 px-4 rounded-lg hover:bg-[#003087] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
                >
                  <img src="/payment-logos/paypal.svg" alt="" className="h-4 sm:h-5 brightness-0 invert" />
                  Complete Order Now
                </button>

                <p className="text-center text-xs text-gray-500 mt-3">
                  Secure checkout powered by PayPal
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderCartStep();
      case 1:
        return renderInformationStep();
      case 2:
        return renderPaymentStep();
      default:
        return null;
    }
  };

  useEffect(() => {
    setCurrentStep(0);
  }, [items.length, isOpen]);

  // Load customer info from cookie/localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('customer_email');
    if (savedEmail) {
      setCustomerInfo(prev => ({ ...prev, email: savedEmail }));
    }
  }, []);

  useEffect(() => {
    setShowTimeoutMessage(false);
    setCountdown(300); // Reset to 5 minutes
  }, [currentStep]);

  useEffect(() => {
    let countdownId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    if (isProcessingPayment) {
      // Start countdown
      countdownId = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Show timeout message after 5 minutes
      timeoutId = setTimeout(() => {
        setShowTimeoutMessage(true);
      }, 300000); // 5 minutes in milliseconds
    }

    return () => {
      if (countdownId) clearInterval(countdownId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isProcessingPayment]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600">Add items to your cart to continue shopping</p>
                  </div>
                ) : (
                  renderStepContent()
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t px-4 py-4 space-y-3">
                {items.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-600">Original Price:</span>
                      <span className="text-xl font-medium text-gray-500 line-through">
                        ${items.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0).toFixed(2)}
                      </span>
                    </div>
                    {items.some(item => item.originalPrice && item.originalPrice > item.price) && (
                      <div className="flex justify-between text-base text-green-600">
                        <span>Your Savings:</span>
                        <span className="font-medium">
                          ${(items.reduce((acc, item) => 
                            acc + ((item.originalPrice || item.price) - item.price) * item.quantity, 0
                          )).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-base">
                      <span>Final Price:</span>
                      <span className="text-xl font-bold text-primary-600">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                <button 
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={items.length === 0}
                  onClick={currentStep === CHECKOUT_STEPS.length - 1 ? handlePayment : handleNext}
                >
                  <span>
                    {currentStep === CHECKOUT_STEPS.length - 1 ? 'Pay Now' : 'Continue'}
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