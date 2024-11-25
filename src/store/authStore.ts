import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { pb } from '../config/pocketbase';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      login: async (email: string, password: string) => {
        try {
          // Initialize PocketBase if not already initialized
          if (!pb.authStore.isValid) {
            await pb.collection('users').authWithPassword(email, password);
          }

          const authData = pb.authStore.model;
          
          if (!authData) {
            throw new Error('Authentication failed');
          }

          const user = {
            id: authData.id,
            email: authData.email,
            name: authData.name || email.split('@')[0],
            role: authData.role || 'user'
          };

          set({ 
            user,
            isAuthenticated: true,
            isAdmin: user.role === 'admin'
          });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },
      logout: () => {
        pb.authStore.clear();
        set({ 
          user: null, 
          isAuthenticated: false, 
          isAdmin: false 
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin
      })
    }
  )
);