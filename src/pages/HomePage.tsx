import React from 'react';
import Hero from '../components/Hero';
import PartnersGrid from '../components/PartnersGrid';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <PartnersGrid />
      <Categories />
      <FeaturedProducts />
      <Features />
      <Testimonials />
    </main>
  );
}