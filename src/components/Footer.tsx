import React from 'react';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  const links = {
    'Categories': ['Design Software', 'Engineering Tools', 'Collaboration', 'Enterprise'],
    'Support': ['Contact', 'Documentation', 'License Info', 'FAQs'],
    'Company': ['About Us', 'Careers', 'Blog', 'Terms'],
    'Legal': ['Privacy Policy', 'Terms of Service', 'Refund Policy', 'License Terms']
  };

  return (
    <footer className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2">
            <div className="mb-4">
              <span className="text-xl font-bold">SoftwareStore</span>
            </div>
            <p className="text-gray-600 mb-4">
              Authorized reseller of professional software licenses
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-5 h-5" />
                <span>support@softwarestore.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-5 h-5" />
                <span>1-800-SOFTWARE</span>
              </div>
            </div>
          </div>
          
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-gray-900 mb-4">{category}</h3>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 pt-8 mt-8 text-center text-gray-600">
          <p>© 2024 SoftwareStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}