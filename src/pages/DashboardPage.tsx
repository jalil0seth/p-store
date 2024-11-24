import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Package2, CreditCard, Settings, History, Database, Users, Layout, FileText } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAdmin } = useAuthStore();

  const adminSections = [
    { icon: Database, title: 'Store Config', description: 'Manage store settings', link: '/admin#config' },
    { icon: Package2, title: 'Products', description: 'Manage product catalog', link: '/admin#products' },
    { icon: Users, title: 'Partners', description: 'Manage store partners', link: '/admin#partners' },
    { icon: Layout, title: 'Features', description: 'Manage store features', link: '/admin#features' },
    { icon: FileText, title: 'Testimonials', description: 'Manage testimonials', link: '/admin#testimonials' }
  ];

  const userSections = [
    { icon: Package2, title: 'My Licenses', count: '5 Active', link: '#' },
    { icon: CreditCard, title: 'Billing', status: 'Up to date', link: '#' },
    { icon: History, title: 'Purchase History', count: '12 Orders', link: '#' },
    { icon: Settings, title: 'Settings', status: 'Manage account', link: '#' }
  ];

  const sections = isAdmin ? adminSections : userSections;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">
              {isAdmin 
                ? 'Manage your store settings and content'
                : 'Manage your software licenses and account settings'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <Link
                key={index}
                to={section.link}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <section.icon className="w-8 h-8 text-primary-500 mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="font-semibold mb-2">{section.title}</h2>
                <p className="text-gray-600">
                  {section.description || section.count || section.status}
                </p>
              </Link>
            ))}
          </div>

          {!isAdmin && (
            <div className="mt-8 bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b last:border-0">
                    <div>
                      <h3 className="font-medium">Adobe Creative Cloud License Renewed</h3>
                      <p className="text-sm text-gray-600">March {10 - index}, 2024</p>
                    </div>
                    <span className="text-primary-600">$54.99</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}