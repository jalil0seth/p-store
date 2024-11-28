import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import ProductsPage from '../pages/admin/ProductsPage';
import UsersPage from '../pages/admin/UsersPage';
import { PocketBaseService } from '../services/PocketBaseService';

const AdminRoutes = () => {
  const isAdmin = PocketBaseService.getInstance().isAdmin();

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/new" element={<div>New Product Form</div>} />
      <Route path="/products/edit/:id" element={<div>Edit Product Form</div>} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/new" element={<div>New User Form</div>} />
      <Route path="/users/edit/:id" element={<div>Edit User Form</div>} />
      <Route path="/settings" element={<div>Settings Page</div>} />
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
};

export default AdminRoutes;
