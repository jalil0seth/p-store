import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import { pb } from './lib/pocketbase';
import { Toaster } from 'sonner';

// Eagerly load critical components
import Header from './components/Header';
import Footer from './components/Footer';
import MobileCTA from './components/MobileCTA';
import ProtectedRoute from './components/ProtectedRoute';
import PageLoader from './components/PageLoader';
import Cart from './components/Cart';

// Lazy load non-critical components
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductPage = lazy(() => import('./pages/product'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Admin components
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminLayout = lazy(() => import('./pages/admin/components/AdminLayout'));
const AdminProductsPage = lazy(() => import('./pages/admin/products'));
const AdminAddProduct = lazy(() => import('./pages/admin/products/add'));
const AdminEditProduct = lazy(() => import('./pages/admin/products/edit'));
const AdminUsersPage = lazy(() => import('./pages/admin/users'));
const AdminAddUser = lazy(() => import('./pages/admin/users/add'));
const AdminEditUser = lazy(() => import('./pages/admin/users/edit'));

export function App() {
  const { theme } = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);
  const { init } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to restore auth from localStorage
        const savedAuth = localStorage.getItem('pocketbase_auth');
        if (savedAuth) {
          const { token, model } = JSON.parse(savedAuth);
          pb.authStore.save(token, model);
        }
        
        await init();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [init]);

  if (!isInitialized) {
    return <PageLoader />;
  }

  return (
    <Router>
      <div className="relative">
        <Toaster 
          position="top-right" 
          closeButton
          richColors
          theme={theme === 'dark' ? 'dark' : 'light'}
          containerStyle={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 9999,
          }}
        />
        <AppContent theme={theme} />
      </div>
    </Router>
  );
}

function AppContent({ theme }: { theme: string }) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { isOpen: isCartOpen, setIsOpen: setIsCartOpen } = useCartStore();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isProductPage = location.pathname.startsWith('/product/');

  return (
    <div className={`min-h-screen ${theme}`}>
      {!isAdminRoute && (
        <>
          <Header />
        </>
      )}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/products" element={<AdminProductsPage />} />
                    <Route path="/products/add" element={<AdminAddProduct />} />
                    <Route path="/products/edit/:id" element={<AdminEditProduct />} />
                    <Route path="/users" element={<AdminUsersPage />} />
                    <Route path="/users/add" element={<AdminAddUser />} />
                    <Route path="/users/edit/:id" element={<AdminEditUser />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && !isProductPage && (
        <MobileCTA />
      )}
    </div>
  );
}