import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import MobileCTA from './components/MobileCTA';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <ProductGrid />
      </main>
      <Footer />
      <MobileCTA />
    </div>
  );
}

export default App;