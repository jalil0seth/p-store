import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            {category 
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Software`
              : 'All Software'}
          </h1>
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}