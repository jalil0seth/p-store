import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
            Authorized Reseller
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Software
            <br />Licensed & Secured
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Official licenses for industry-leading software at competitive prices
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#products" 
              className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Browse Software</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}