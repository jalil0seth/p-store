import React from 'react';
import Hero from '../components/Hero';
import BrandBar from '../components/BrandBar';
import ProductShowcase from '../components/ProductShowcase';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <BrandBar />
      <ProductShowcase />
      <Features />
      <Testimonials />
    </main>
  );
}