import React, { useEffect } from 'react';
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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
        <MobileCTA />
        <FloatingElements />
      </div>
    </Router>
  );
}

export default App;