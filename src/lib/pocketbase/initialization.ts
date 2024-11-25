import { validateConnection } from './auth';
import { authenticateAdmin } from './auth';
import { COLLECTIONS, createCollectionIfNotExists } from './collections';
import { pb } from './config';

const INITIAL_CONFIG = {
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

const INITIAL_ADMIN = {
  email: 'admin@softwarestore.com',
  password: 'adminpassword123',
  passwordConfirm: 'adminpassword123',
  name: 'Admin User',
  role: 'admin'
};

export async function initializePocketBase() {
  try {
    // Check connection
    const isConnected = await validateConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to PocketBase server');
    }

    // Authenticate as admin
    const isAuthenticated = await authenticateAdmin();
    if (!isAuthenticated) {
      throw new Error('Failed to authenticate as admin');
    }

    // Create collections
    for (const collection of Object.values(COLLECTIONS)) {
      const created = await createCollectionIfNotExists(collection);
      
      if (created) {
        // Initialize with default data if needed
        if (collection.name === 'store_config') {
          await pb.collection('store_config').create(INITIAL_CONFIG);
          console.log('Initial store config created');
        }
        
        if (collection.name === 'users') {
          await pb.collection('users').create(INITIAL_ADMIN);
          console.log('Initial admin user created');
        }
      }
    }

    return true;
  } catch (error) {
    console.error('PocketBase initialization failed:', error);
    return false;
  }
}