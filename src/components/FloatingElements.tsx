import React, { useState, useEffect } from 'react';
import { MessageCircle, ChevronUp, Globe, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingElements() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Chat Widget */}
      <button 
        className="fixed bottom-20 right-4 z-50 p-4 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-20 z-50 p-3 bg-white text-gray-900 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Language Selector */}
      <button 
        className="fixed bottom-4 right-4 z-50 p-3 bg-white text-gray-900 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-6 h-6" />
      </button>

      {/* Cookie Consent */}
      <AnimatePresence>
        {showCookieConsent && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50 p-4 md:p-6"
          >
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowCookieConsent(false)}
                  className="btn btn-primary"
                >
                  Accept
                </button>
                <button
                  onClick={() => setShowCookieConsent(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close cookie consent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}