import { pb, ADMIN_EMAIL, ADMIN_PASSWORD } from './config';

export async function authenticateAdmin() {
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('Admin authentication successful');
    return true;
  } catch (error) {
    console.error('Admin authentication failed:', error);
    return false;
  }
}

export async function validateConnection() {
  try {
    await pb.health.check();
    console.log('PocketBase connection successful');
    return true;
  } catch (error) {
    console.error('PocketBase connection failed:', error);
    return false;
  }
}