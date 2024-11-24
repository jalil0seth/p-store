import React, { useState } from 'react';
import { Settings, Package, Users, Star, Layout, FileText } from 'lucide-react';
import AdminConfig from '../components/admin/AdminConfig';
import AdminProducts from '../components/admin/AdminProducts';
import AdminPartners from '../components/admin/AdminPartners';
import AdminTestimonials from '../components/admin/AdminTestimonials';
import AdminFeatures from '../components/admin/AdminFeatures';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '../lib/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('config');
  const { user } = useAuthStore();

  if (!user || !isAdmin()) {
    return <Navigate to="/signin" replace />;
  }

  const tabs = [
    { id: 'config', label: 'Store Config', icon: Settings },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'partners', label: 'Partners', icon: Users },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'features', label: 'Features', icon: Layout }
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'config' && <AdminConfig />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'partners' && <AdminPartners />}
        {activeTab === 'testimonials' && <AdminTestimonials />}
        {activeTab === 'features' && <AdminFeatures />}
      </div>
    </div>
  );
}