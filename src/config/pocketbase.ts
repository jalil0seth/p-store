import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://217.76.51.2:8090');

// Types for our collections
export interface StoreConfig {
  id: string;
  store_name: string;
  store_description: string;
  store_logo: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  features_title: string;
  features_subtitle: string;
  testimonials_title: string;
  testimonials_subtitle: string;
  footer_description: string;
  social_links: { platform: string; url: string }[];
  contact_email: string;
  contact_phone: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  discount: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  features: string[];
  specs: Record<string, string[]>;
}

export interface StorePartner {
  id: string;
  name: string;
  logo: string;
  description: string;
  url: string;
}

export interface StoreTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
}

export interface StoreFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
}