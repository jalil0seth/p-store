import React, { useState, useEffect } from 'react';
import { MessageCircle, ChevronUp, Globe, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingElements() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

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

  const handleAcceptAll = () => {
    setCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true
    });
    setShowCookieConsent(false);
  };

  return (
    <>
      <button 
        className="fixed bottom-20 right-4 z-50 p-4 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

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

      <AnimatePresence>
        {showCookieConsent && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-4 right-4 max-w-sm z-50 bg-white rounded-xl shadow-xl border border-gray-100"
          >
            {!showCookieSettings ? (
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Cookie Settings</h3>
                  <button
                    onClick={() => setShowCookieConsent(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  We use cookies to enhance your experience. Choose your preferences below.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={() => setShowCookieSettings(true)}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Cookie Preferences</h3>
                  <button
                    onClick={() => setShowCookieSettings(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Necessary</p>
                      <p className="text-sm text-gray-500">Required for basic functionality</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={cookiePreferences.necessary}
                      disabled
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Analytics</p>
                      <p className="text-sm text-gray-500">Help us improve our website</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={cookiePreferences.analytics}
                      onChange={(e) => setCookiePreferences(prev => ({
                        ...prev,
                        analytics: e.target.checked
                      }))}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing</p>
                      <p className="text-sm text-gray-500">Personalized advertisements</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={cookiePreferences.marketing}
                      onChange={(e) => setCookiePreferences(prev => ({
                        ...prev,
                        marketing: e.target.checked
                      }))}
                      className="rounded border-gray-300"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowCookieConsent(false)}
                  className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}