import { pb } from '../config/pocketbase';
import type { 
  StoreConfig, 
  StoreProduct, 
  StorePartner,
  StoreTestimonial,
  StoreFeature,
  User 
} from '../config/pocketbase';

// Helper function to handle API errors
async function handleApiRequest<T>(request: Promise<T>): Promise<T> {
  try {
    return await request;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Config
export async function getStoreConfig(): Promise<StoreConfig> {
  return handleApiRequest(
    pb.collection('store_config').getFirstListItem('')
  ) as Promise<StoreConfig>;
}

export async function updateStoreConfig(config: Partial<StoreConfig>): Promise<StoreConfig> {
  return handleApiRequest(
    pb.collection('store_config').update(config.id!, config)
  ) as Promise<StoreConfig>;
}

// Products
export async function getProducts(): Promise<StoreProduct[]> {
  return handleApiRequest(
    pb.collection('store_products').getFullList()
  ) as Promise<StoreProduct[]>;
}

export async function getProduct(id: string): Promise<StoreProduct> {
  return handleApiRequest(
    pb.collection('store_products').getOne(id)
  ) as Promise<StoreProduct>;
}

export async function createProduct(product: Omit<StoreProduct, 'id'>): Promise<StoreProduct> {
  return handleApiRequest(
    pb.collection('store_products').create(product)
  ) as Promise<StoreProduct>;
}

export async function updateProduct(id: string, product: Partial<StoreProduct>): Promise<StoreProduct> {
  return handleApiRequest(
    pb.collection('store_products').update(id, product)
  ) as Promise<StoreProduct>;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await handleApiRequest(pb.collection('store_products').delete(id));
  return true;
}

// Partners
export async function getPartners(): Promise<StorePartner[]> {
  return handleApiRequest(
    pb.collection('store_partners').getFullList()
  ) as Promise<StorePartner[]>;
}

// Testimonials
export async function getTestimonials(): Promise<StoreTestimonial[]> {
  return handleApiRequest(
    pb.collection('store_testimonials').getFullList()
  ) as Promise<StoreTestimonial[]>;
}

// Features
export async function getFeatures(): Promise<StoreFeature[]> {
  return handleApiRequest(
    pb.collection('store_features').getFullList()
  ) as Promise<StoreFeature[]>;
}

// Auth
export async function login(email: string, password: string): Promise<User> {
  const authData = await handleApiRequest(
    pb.collection('users').authWithPassword(email, password)
  );
  return authData.record as User;
}

export async function logout() {
  pb.authStore.clear();
}

export async function register(data: { 
  email: string; 
  password: string; 
  passwordConfirm: string;
  name: string;
}): Promise<User> {
  return handleApiRequest(
    pb.collection('users').create({
      ...data,
      role: 'user'
    })
  ) as Promise<User>;
}

// Admin check
export function isAdmin(): boolean {
  const user = pb.authStore.model as User | null;
  return user?.role === 'admin';
}