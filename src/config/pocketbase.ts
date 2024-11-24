import PocketBase from 'pocketbase';

// Initialize PocketBase with the correct URL
export const pb = new PocketBase('http://127.0.0.1:8090');

// Default admin credentials
const ADMIN_EMAIL = 'admin@softwarestore.com';
const ADMIN_PASSWORD = 'adminpassword123';

// Initialize admin login
export async function initializeAdmin() {
  try {
    const authData = await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('Admin authenticated:', authData);
    return authData;
  } catch (error) {
    console.error('Admin authentication failed:', error);
    throw error;
  }
}

// Initialize collections
export async function initializeCollections() {
  try {
    // Create collections if they don't exist
    const collections = [
      {
        name: 'store_config',
        type: 'base',
        schema: [
          { name: 'store_name', type: 'text', required: true },
          { name: 'store_description', type: 'text' },
          { name: 'store_logo', type: 'text' },
          { name: 'hero_title', type: 'text' },
          { name: 'hero_subtitle', type: 'text' },
          { name: 'hero_image', type: 'text' },
          { name: 'features_title', type: 'text' },
          { name: 'features_subtitle', type: 'text' },
          { name: 'testimonials_title', type: 'text' },
          { name: 'testimonials_subtitle', type: 'text' },
          { name: 'footer_description', type: 'text' },
          { name: 'social_links', type: 'json' },
          { name: 'contact_email', type: 'text' },
          { name: 'contact_phone', type: 'text' }
        ]
      },
      {
        name: 'store_products',
        type: 'base',
        schema: [
          { name: 'name', type: 'text', required: true },
          { name: 'description', type: 'text' },
          { name: 'price', type: 'number', required: true },
          { name: 'original_price', type: 'number' },
          { name: 'discount', type: 'number' },
          { name: 'category', type: 'text' },
          { name: 'image', type: 'text' },
          { name: 'rating', type: 'number' },
          { name: 'reviews', type: 'number' },
          { name: 'badge', type: 'text' },
          { name: 'features', type: 'json' },
          { name: 'specs', type: 'json' }
        ]
      },
      {
        name: 'store_partners',
        type: 'base',
        schema: [
          { name: 'name', type: 'text', required: true },
          { name: 'logo', type: 'text' },
          { name: 'description', type: 'text' },
          { name: 'url', type: 'text' }
        ]
      },
      {
        name: 'store_testimonials',
        type: 'base',
        schema: [
          { name: 'name', type: 'text', required: true },
          { name: 'role', type: 'text' },
          { name: 'company', type: 'text' },
          { name: 'image', type: 'text' },
          { name: 'content', type: 'text' },
          { name: 'rating', type: 'number' }
        ]
      },
      {
        name: 'store_features',
        type: 'base',
        schema: [
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'text' },
          { name: 'icon', type: 'text' },
          { name: 'color', type: 'text' }
        ]
      }
    ];

    for (const collection of collections) {
      try {
        await pb.collections.create(collection);
        console.log(`Collection ${collection.name} created successfully`);
      } catch (error) {
        console.log(`Collection ${collection.name} might already exist:`, error);
      }
    }

    // Initialize default store config if it doesn't exist
    const storeConfig = await pb.collection('store_config').getList(1, 1);
    if (storeConfig.totalItems === 0) {
      await pb.collection('store_config').create({
        store_name: 'Software Store',
        store_description: 'Your one-stop shop for premium software licenses',
        hero_title: 'Premium Software for Modern Teams',
        hero_subtitle: 'Get instant access to premium software licenses at competitive prices',
        features_title: 'Powerful Features',
        features_subtitle: 'Everything you need to manage software licenses efficiently',
        contact_email: 'support@softwarestore.com',
        contact_phone: '1-800-SOFTWARE',
        social_links: [
          { platform: 'twitter', url: 'https://twitter.com' },
          { platform: 'github', url: 'https://github.com' },
          { platform: 'linkedin', url: 'https://linkedin.com' }
        ]
      });
    }

  } catch (error) {
    console.error('Error initializing collections:', error);
    throw error;
  }
}

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