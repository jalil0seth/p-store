import PocketBase from 'pocketbase';
import { MockPocketBase } from '../lib/mockPocketBase';

// Initialize PocketBase with the actual backend URL
const POCKETBASE_URL = 'http://217.76.51.2:8090';

// Create real or mock instance based on connection success
let pb: PocketBase | MockPocketBase;

try {
  pb = new PocketBase(POCKETBASE_URL);
} catch (error) {
  console.warn('Failed to initialize PocketBase, falling back to mock implementation');
  pb = new MockPocketBase();
}

// Admin credentials
export const ADMIN_EMAIL = 'fc96b2ce-c8f9-4a77-a323-077f92f176ac@user.com';
export const ADMIN_PASSWORD = 'fc96b2ce-c8f9-4a77-a323-077f92f176ac';

// Export the instance
export { pb };

// Types for our collections
export interface StoreConfig {
  id: string;
  store_name: string;
  store_description: string;
  hero_title: string;
  hero_subtitle: string;
  contact_email: string;
  contact_phone: string;
  social_links: {
    twitter: string;
    linkedin: string;
    github: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
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
  content: string;
  rating: number;
  image: string;
}

export interface StoreFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}