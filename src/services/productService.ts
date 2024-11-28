import { pb } from '../lib/pocketbase';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    category: string;
    created: string;
    updated: string;
}

const COLLECTION = 'store_products';

export const productService = {
    async create(data: Omit<Product, 'id' | 'created' | 'updated'>) {
        return await pb.collection(COLLECTION).create(data);
    },

    async update(id: string, data: Partial<Product>) {
        return await pb.collection(COLLECTION).update(id, data);
    },

    async delete(id: string) {
        return await pb.collection(COLLECTION).delete(id);
    },

    async getOne(id: string) {
        return await pb.collection(COLLECTION).getOne(id);
    },

    async getList(page: number = 1, perPage: number = 20, filter: string = '') {
        return await pb.collection(COLLECTION).getList(page, perPage, {
            filter,
            sort: '-created',
        });
    },

    async search(query: string) {
        return await pb.collection(COLLECTION).getList(1, 20, {
            filter: `name ~ "${query}" || description ~ "${query}"`,
        });
    }
};
