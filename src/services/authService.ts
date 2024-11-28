import { pb } from '../lib/pocketbase';

export interface User {
    id: string;
    email: string;
    name: string;
    created: string;
    updated: string;
}

const COLLECTION = 'store_users';

export const authService = {
    async register(email: string, password: string, name: string) {
        const data = {
            email,
            password,
            passwordConfirm: password,
            name,
        };
        return await pb.collection(COLLECTION).create(data);
    },

    async login(email: string, password: string) {
        return await pb.collection(COLLECTION).authWithPassword(email, password);
    },

    async requestPasswordReset(email: string) {
        return await pb.collection(COLLECTION).requestPasswordReset(email);
    },

    async updateProfile(userId: string, data: Partial<User>) {
        return await pb.collection(COLLECTION).update(userId, data);
    },

    async getProfile() {
        if (!pb.authStore.model?.id) {
            throw new Error('Not authenticated');
        }
        return await pb.collection(COLLECTION).getOne(pb.authStore.model.id);
    },

    logout() {
        pb.authStore.clear();
    },

    isAuthenticated() {
        return pb.authStore.isValid;
    },

    getCurrentUser() {
        return pb.authStore.model;
    }
};
