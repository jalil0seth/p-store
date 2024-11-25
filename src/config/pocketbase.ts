import PocketBase from 'pocketbase';

// Initialize PocketBase with the backend URL
export const pb = new PocketBase('https://pocketbase-stackblitz.fly.dev');

// Admin credentials
const ADMIN_EMAIL = 'fc96b2ce-c8f9-4a77-a323-077f92f176ac@user.com';
const ADMIN_PASSWORD = 'fc96b2ce-c8f9-4a77-a323-077f92f176ac';

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

// Validate PocketBase connection
async function validateConnection() {
  try {
    await pb.health.check();
    return true;
  } catch (error) {
    console.error('PocketBase connection failed:', error);
    return false;
  }
}

// Initialize collections if they don't exist
export async function initializeCollections() {
  try {
    // First validate the connection
    const isConnected = await validateConnection();
    if (!isConnected) {
      throw new Error('Unable to connect to PocketBase server');
    }

    // Authenticate as admin
    try {
      await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    } catch (error) {
      console.error('Admin authentication failed:', error);
      throw new Error('Admin authentication failed');
    }

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
      const collections = await pb.collections.getList(1, 50, {
        filter: 'name = "store_config"'
      });
      
      if (collections.items.length === 0) {
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
      }
    } catch (error) {
      console.error('Error creating store config:', error);
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
      const collections = await pb.collections.getList(1, 50, {
        filter: 'name = "users"'
      });
      
      if (collections.items.length === 0) {
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
      }
    } catch (error) {
      console.error('Error creating users collection:', error);
    }

  } catch (error) {
    console.error('Error initializing collections:', error);
  }
}

// Initialize PocketBase on app start
initializeCollections().catch(console.error);