import React from 'react';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Reviews from '../components/Reviews';

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <FeaturedProducts />
      <Reviews />
    </main>
  );
}