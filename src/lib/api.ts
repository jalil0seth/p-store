import { pb } from '../config/pocketbase';
import type { 
  StoreConfig, 
  StoreProduct, 
  StorePartner,
  StoreTestimonial,
  StoreFeature,
  User 
} from '../config/pocketbase';

// Config
export async function getStoreConfig(): Promise<StoreConfig> {
  const record = await pb.collection('store_config').getFirstListItem('');
  return record as StoreConfig;
}

export async function updateStoreConfig(config: Partial<StoreConfig>): Promise<StoreConfig> {
  const record = await pb.collection('store_config').update(config.id!, config);
  return record as StoreConfig;
}

// Products
export async function getProducts(): Promise<StoreProduct[]> {
  const records = await pb.collection('store_products').getFullList();
  return records as StoreProduct[];
}

export async function getProduct(id: string): Promise<StoreProduct> {
  const record = await pb.collection('store_products').getOne(id);
  return record as StoreProduct;
}

export async function createProduct(product: Omit<StoreProduct, 'id'>): Promise<StoreProduct> {
  const record = await pb.collection('store_products').create(product);
  return record as StoreProduct;
}

export async function updateProduct(id: string, product: Partial<StoreProduct>): Promise<StoreProduct> {
  const record = await pb.collection('store_products').update(id, product);
  return record as StoreProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await pb.collection('store_products').delete(id);
  return true;
}

// Partners
export async function getPartners(): Promise<StorePartner[]> {
  const records = await pb.collection('store_partners').getFullList();
  return records as StorePartner[];
}

// Testimonials
export async function getTestimonials(): Promise<StoreTestimonial[]> {
  const records = await pb.collection('store_testimonials').getFullList();
  return records as StoreTestimonial[];
}

// Features
export async function getFeatures(): Promise<StoreFeature[]> {
  const records = await pb.collection('store_features').getFullList();
  return records as StoreFeature[];
}

// Auth
export async function login(email: string, password: string): Promise<User> {
  const authData = await pb.collection('users').authWithPassword(email, password);
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
  const record = await pb.collection('users').create({
    ...data,
    role: 'user'
  });
  return record as User;
}

// Admin check
export function isAdmin(): boolean {
  const user = pb.authStore.model as User | null;
  return user?.role === 'admin';
}