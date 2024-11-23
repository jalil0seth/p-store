import React from 'react';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Features from '../components/Features';
import Reviews from '../components/Reviews';
import Categories from '../components/Categories';

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="space-y-32">
        <Categories />
        <FeaturedProducts />
        <Features />
        <Reviews />
      </div>
    </main>
  );
}