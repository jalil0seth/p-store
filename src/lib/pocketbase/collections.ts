import { pb } from './config';
import type { Collection } from './types';

export const COLLECTIONS: Record<string, Collection> = {
  store_config: {
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
  },
  users: {
    name: 'users',
    type: 'auth',
    schema: [
      { name: 'name', type: 'text', required: true },
      {
        name: 'role',
        type: 'select',
        required: true,
        options: {
          values: ['user', 'admin']
        }
      }
    ]
  }
};

export async function createCollectionIfNotExists(collection: Collection) {
  try {
    const exists = await pb.collections.getList(1, 1, {
      filter: `name = "${collection.name}"`
    });

    if (exists.items.length === 0) {
      await pb.collections.create(collection);
      console.log(`Collection ${collection.name} created successfully`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error creating collection ${collection.name}:`, error);
    return false;
  }
}