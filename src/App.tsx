import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileCTA from './components/MobileCTA';
import FloatingElements from './components/FloatingElements';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import ProductPage from './pages/ProductPage';
import ProductsPage from './pages/ProductsPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/Cart';

export function App() {
  const { theme } = useTheme();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header onOpenCart={handleOpenCart} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/products" element={<ProductsPage onOpenCart={handleOpenCart} />} />
          <Route path="/product/:id" element={<ProductPage onOpenCart={handleOpenCart} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
        <MobileCTA onOpenCart={handleOpenCart} />
        <FloatingElements />
        <Cart isOpen={isCartOpen} onClose={handleCloseCart} />
      </div>
    </Router>
  );
}

export default App;