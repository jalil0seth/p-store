import { StoreConfig, User } from './pocketbase/types';

// Mock data
const mockStoreConfig: StoreConfig = {
  id: 'mock-config-1',
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

const mockUsers: User[] = [
  {
    id: 'mock-user-1',
    email: 'admin@softwarestore.com',
    name: 'Admin User',
    role: 'admin'
  }
];

// Mock PocketBase class
export class MockPocketBase {
  private authStore: {
    model: User | null;
    isValid: boolean;
    clear: () => void;
  };

  constructor() {
    this.authStore = {
      model: null,
      isValid: false,
      clear: () => {
        this.authStore.model = null;
        this.authStore.isValid = false;
      }
    };
  }

  collection(name: string) {
    return {
      authWithPassword: async (email: string, password: string) => {
        const user = mockUsers.find(u => u.email === email);
        if (!user || password !== 'adminpassword123') {
          throw new Error('Invalid credentials');
        }
        this.authStore.model = user;
        this.authStore.isValid = true;
        return { record: user };
      },
      getFirstListItem: async () => {
        return mockStoreConfig;
      },
      create: async (data: any) => {
        return { ...data, id: 'mock-' + Date.now() };
      },
      update: async (id: string, data: any) => {
        return { ...data, id };
      },
      getFullList: async () => {
        return [];
      }
    };
  }

  health = {
    check: async () => ({ code: 200, message: 'OK' })
  };
}

// Export mock instance
export const mockPb = new MockPocketBase();