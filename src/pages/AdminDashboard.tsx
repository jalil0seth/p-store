import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Settings, Package, Users, Star, Layout } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AdminConfig from '../components/admin/AdminConfig';
import AdminProducts from '../components/admin/AdminProducts';
import AdminPartners from '../components/admin/AdminPartners';
import AdminTestimonials from '../components/admin/AdminTestimonials';
import AdminFeatures from '../components/admin/AdminFeatures';

export default function AdminDashboard() {
  const location = useLocation();
  const hash = location.hash.replace('#', '') || 'config';
  const [activeTab, setActiveTab] = useState(hash);
  const { isAdmin } = useAuthStore();

  useEffect(() => {
    setActiveTab(hash);
  }, [hash]);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const tabs = [
    { id: 'config', label: 'Store Config', icon: Settings },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'partners', label: 'Partners', icon: Users },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'features', label: 'Features', icon: Layout }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'config':
        return <AdminConfig />;
      case 'products':
        return <AdminProducts />;
      case 'partners':
        return <AdminPartners />;
      case 'testimonials':
        return <AdminTestimonials />;
      case 'features':
        return <AdminFeatures />;
      default:
        return <AdminConfig />;
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
}