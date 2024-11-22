import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Package2, CreditCard, Settings, History } from 'lucide-react';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const sections = [
    { icon: Package2, title: 'My Licenses', count: '5 Active' },
    { icon: CreditCard, title: 'Billing', status: 'Up to date' },
    { icon: History, title: 'Purchase History', count: '12 Orders' },
    { icon: Settings, title: 'Settings', status: 'Manage account' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">Manage your software licenses and account settings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <section.icon className="w-8 h-8 text-blue-600 mb-4" />
                <h2 className="font-semibold mb-2">{section.title}</h2>
                <p className="text-gray-600">{section.count || section.status}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b last:border-0">
                  <div>
                    <h3 className="font-medium">Adobe Creative Cloud License Renewed</h3>
                    <p className="text-sm text-gray-600">March {10 - index}, 2024</p>
                  </div>
                  <span className="text-blue-600">$54.99</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}