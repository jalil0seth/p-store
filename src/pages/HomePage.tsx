import React from 'react';
import Hero from '../components/Hero';
import BrandBar from '../components/BrandBar';
import FeaturedProducts from '../components/FeaturedProducts';
import Reviews from '../components/Reviews';

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <BrandBar />
      <div className="space-y-16">
        <FeaturedProducts />
        <Reviews />
      </div>
    </main>
  );
}