import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';

// Eagerly load critical components
import Hero from '../components/Hero';
import BrandBar from '../components/BrandBar';

// Lazy load non-critical components
const FeaturedProducts = lazy(() => import('../components/FeaturedProducts'));
const Reviews = lazy(() => import('../components/Reviews'));
const SalesNotifications = lazy(() => import('../components/SalesNotifications'));
const CookieConsent = lazy(() => import('../components/CookieConsent'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="w-full h-32 flex items-center justify-center">
    <div className="animate-pulse text-gray-400">Loading...</div>
  </div>
);

export default function HomePage() {
  const [showCookieConsent, setShowCookieConsent] = useState(() => {
    // Initialize from localStorage during component mount
    return !localStorage.getItem('cookieConsent');
  });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Initialize sales notification after a delay
    const notificationTimer = setTimeout(() => {
      setShowNotification(true);
    }, 2000);

    // Rotate notifications every 10 seconds
    const interval = setInterval(() => {
      setShowNotification(prev => {
        if (!prev) return true;
        setTimeout(() => setShowNotification(true), 500);
        return false;
      });
    }, 10000);

    return () => {
      clearTimeout(notificationTimer);
      clearInterval(interval);
    };
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowCookieConsent(false);
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShowCookieConsent(false);
  };

  return (
    <main className="overflow-hidden">
      <Hero />
      <BrandBar />
      <Suspense fallback={<LoadingFallback />}>
        <div className="space-y-16">
          <FeaturedProducts />
          <Reviews />
        </div>

        <AnimatePresence>
          {showNotification && <SalesNotifications show={showNotification} />}
        </AnimatePresence>

        <AnimatePresence>
          {showCookieConsent && (
            <CookieConsent
              show={showCookieConsent}
              onAccept={handleAcceptCookies}
              onDecline={handleDeclineCookies}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </main>
  );
}