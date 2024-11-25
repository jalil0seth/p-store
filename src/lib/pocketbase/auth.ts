import { pb, ADMIN_EMAIL, ADMIN_PASSWORD } from '../../config/pocketbase';

export async function authenticateAdmin() {
  try {
    const authData = await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('Admin authentication successful');
    return true;
  } catch (error) {
    console.error('Admin authentication failed:', error);
    return false;
  }
}

export async function validateConnection() {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), 5000);
    });

    const healthCheckPromise = pb.health.check();
    
    const health = await Promise.race([healthCheckPromise, timeoutPromise]);
    console.log('PocketBase connection successful');
    return true;
  } catch (error) {
    console.error('PocketBase connection failed:', error);
    return false;
  }
}