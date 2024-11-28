import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUsers, FiBox, FiHome, FiSettings } from 'react-icons/fi';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/products', icon: FiBox, label: 'Products' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
      />
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '250px' }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
          <button
            onClick={onToggle}
            className="p-2 rounded-md lg:hidden hover:bg-gray-100"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                    isActive(item.path) ? 'bg-gray-100 font-semibold' : ''
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
