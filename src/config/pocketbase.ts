import PocketBase from 'pocketbase';

// Initialize PocketBase with the backend URL
export const pb = new PocketBase('http://127.0.0.1:8090');

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

// Initialize collections if they don't exist
export async function initializeCollections() {
  try {
    // Create store_config collection if it doesn't exist
    const configCollection = {
      name: 'store_config',
      type: 'base',
      schema: [
        { name: 'store_name', type: 'text', required: true },
        { name: 'store_description', type: 'text', required: true },
        { name: 'hero_title', type: 'text', required: true },
        { name: 'hero_subtitle', type: 'text', required: true },
        { name: 'contact_email', type: 'text', required: true },
        { name: 'contact_phone', type: 'text', required: true },
        { name: 'social_links', type: 'json', required: true }
      ]
    };

    try {
      await pb.collections.create(configCollection);
      console.log('Store config collection created successfully');

      // Create initial config
      const initialConfig = {
        store_name: 'Software Store',
        store_description: 'Your one-stop shop for premium software licenses',
        hero_title: 'Premium Software for Modern Teams',
        hero_subtitle: 'Get instant access to premium software licenses at competitive prices',
        contact_email: 'support@softwarestore.com',
        contact_phone: '1-800-SOFTWARE',
        social_links: {
          twitter: 'https://twitter.com',
          linkedin: 'https://linkedin.com',
          github: 'https://github.com'
        }
      };

      await pb.collection('store_config').create(initialConfig);
      console.log('Initial store config created successfully');
    } catch (error) {
      console.log('Store config collection might already exist:', error);
    }

    // Create users collection if it doesn't exist
    const usersCollection = {
      name: 'users',
      type: 'auth',
      schema: [
        {
          name: 'name',
          type: 'text',
          required: true
        },
        {
          name: 'role',
          type: 'select',
          options: {
            values: ['user', 'admin']
          },
          required: true
        }
      ]
    };

    try {
      await pb.collections.create(usersCollection);
      console.log('Users collection created successfully');

      // Create default admin user
      const adminData = {
        email: 'admin@softwarestore.com',
        password: 'adminpassword123',
        passwordConfirm: 'adminpassword123',
        name: 'Admin User',
        role: 'admin'
      };

      await pb.collection('users').create(adminData);
      console.log('Default admin user created successfully');
    } catch (error) {
      console.log('Users collection might already exist:', error);
    }

  } catch (error) {
    console.error('Error initializing collections:', error);
  }
}

// Initialize PocketBase on app start
initializeCollections();