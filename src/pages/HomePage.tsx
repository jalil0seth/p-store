import React from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import CreativeCloud from '../components/CreativeCloud';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProductGrid />
      <Features />
      <Testimonials />
      <CreativeCloud />
    </main>
  );
}