import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import BrandBar from '../components/BrandBar';
import FeaturedProducts from '../components/FeaturedProducts';
import Reviews from '../components/Reviews';
import SalesNotifications from '../components/SalesNotifications';
import CookieConsent from '../components/CookieConsent';

export default function HomePage() {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Initialize cookie consent after a short delay
    const cookieTimer = setTimeout(() => {
      const cookieConsent = localStorage.getItem('cookieConsent');
      setShowCookieConsent(!cookieConsent);
    }, 1000);

    // Initialize sales notification after a delay
    const notificationTimer = setTimeout(() => {
      setShowNotification(true);
    }, 2000);

    // Rotate notifications every 10 seconds
    const interval = setInterval(() => {
      setShowNotification(false);
      setTimeout(() => {
        setShowNotification(true);
      }, 500);
    }, 10000);

    return () => {
      clearTimeout(cookieTimer);
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
    </main>
  );
}