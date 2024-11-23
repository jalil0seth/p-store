import React, { useState, useEffect } from 'react';
import { MessageCircle, ChevronUp, Globe, X, Settings, Send, User, Mail, MessageSquare } from 'lucide-react';
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
  const [notifications, setNotifications] = useState<Array<{id: number, country: string}>>([]);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatForm, setChatForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  let notificationCount = 0;

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 
    'Germany', 'France', 'Japan', 'Brazil', 'India'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Add new notification every 20 seconds
    const addInterval = setInterval(() => {
      // Only show notification if there are less than 2 currently showing
      if (notifications.length < 2) {
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        notificationCount++;
        setNotifications(prev => [...prev, { id: notificationCount, country: randomCountry }]);
      }
    }, 20000);

    // Remove notifications after 6 seconds to give time to read
    const removeInterval = setInterval(() => {
      setNotifications(prev => prev.slice(1));
    }, 6000);

    return () => {
      clearInterval(addInterval);
      clearInterval(removeInterval);
    };
  }, [notifications.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAcceptAll = () => {
    setCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true
    });
    setCookieAccepted(true);
    setShowCookieConsent(false);
  };

  const handleSavePreferences = () => {
    setCookieAccepted(true);
    setShowCookieConsent(false);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle chat submission here
    console.log('Chat submitted:', chatForm);
    // Reset form
    setChatForm({ name: '', email: '', message: '' });
    setIsChatOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50 space-y-2">
        <AnimatePresence>
          {cookieAccepted && (
            <>
              {/* Redesigned Chat Window */}
              <AnimatePresence>
                {isChatOpen && (
                  <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '-100%', opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-sm mb-2 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-primary-500 p-4 text-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold">Chat with us</h3>
                          <p className="text-sm text-primary-100">We typically reply within minutes</p>
                        </div>
                        <button
                          onClick={() => setIsChatOpen(false)}
                          className="p-1.5 hover:bg-primary-400 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Chat Form */}
                    <div className="p-6">
                      <form onSubmit={handleChatSubmit} className="space-y-5">
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                              Full Name
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                id="name"
                                required
                                value={chatForm.name}
                                onChange={(e) => setChatForm(prev => ({ ...prev, name: e.target.value }))}
                                className="pl-11 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                placeholder="John Doe"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                              Email Address
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="email"
                                id="email"
                                required
                                value={chatForm.email}
                                onChange={(e) => setChatForm(prev => ({ ...prev, email: e.target.value }))}
                                className="pl-11 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                placeholder="john@example.com"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                              How can we help?
                            </label>
                            <div className="relative">
                              <div className="absolute top-3 left-3 pointer-events-none">
                                <MessageSquare className="h-5 w-5 text-gray-400" />
                              </div>
                              <textarea
                                id="message"
                                required
                                value={chatForm.message}
                                onChange={(e) => setChatForm(prev => ({ ...prev, message: e.target.value }))}
                                rows={4}
                                className="pl-11 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                                placeholder="Type your message here..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                          >
                            Send Message
                            <Send className="w-4 h-4" />
                          </button>
                          <p className="text-xs text-center text-gray-500">
                            By sending a message, you agree to our{' '}
                            <a href="#" className="text-primary-500 hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-primary-500 hover:underline">Privacy Policy</a>
                          </p>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Button */}
              <motion.button 
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="p-4 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors"
                onClick={() => setIsChatOpen(true)}
                aria-label="Open chat"
              >
                <MessageCircle className="w-6 h-6" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {cookieAccepted && notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-sm"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="p-2 bg-primary-50 rounded-full">
                      <Globe className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Recent Purchase</p>
                      <p className="text-xs text-gray-500">Someone from {notif.country} just made a purchase!</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {showCookieConsent && !cookieAccepted && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-sm"
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
                    onClick={handleSavePreferences}
                    className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
    </>
  );
}