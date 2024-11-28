import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { pocketBaseService } from '../services/PocketBaseService';

interface User {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
    created?: string;
    updated?: string;
    verified?: boolean;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAdmin: boolean;
}

interface AuthActions {
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    init: () => Promise<void>;
    setUser: (user: User | null) => void;
    clearError: () => void;
    refreshUser: () => Promise<void>;
}

interface RegisterData {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            error: null,
            isAdmin: false,

            setUser: (user: User | null) => {
                set({ 
                    user,
                    isAdmin: user?.isAdmin || false,
                    error: null 
                });
            },

            clearError: () => {
                set({ error: null });
            },

            init: async () => {
                set({ isLoading: true });
                try {
                    if (pocketBaseService.isAuthenticated()) {
                        const userData = pocketBaseService.getCurrentUser();
                        if (userData) {
                            const user: User = {
                                id: userData.id,
                                email: userData.email,
                                name: userData.name,
                                isAdmin: userData.isAdmin === true,
                                created: userData.created,
                                updated: userData.updated,
                                verified: userData.verified
                            };
                            set({ 
                                user,
                                isAdmin: user.isAdmin,
                                error: null 
                            });
                        } else {
                            set({ user: null, isAdmin: false });
                        }
                    }
                } catch (error) {
                    console.error('Auth initialization failed:', error);
                    set({ error: 'Authentication initialization failed' });
                } finally {
                    set({ isLoading: false });
                }
            },

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const authData = await pocketBaseService.login(email, password);
                    
                    const user: User = {
                        id: authData.record.id,
                        email: authData.record.email,
                        name: authData.record.name,
                        isAdmin: authData.record.isAdmin === true,
                        created: authData.record.created,
                        updated: authData.record.updated,
                        verified: authData.record.verified
                    };
                    
                    set({ 
                        user,
                        isAdmin: user.isAdmin,
                        error: null 
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Login failed';
                    set({ 
                        user: null, 
                        isAdmin: false,
                        error: errorMessage 
                    });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            register: async (userData: RegisterData) => {
                set({ isLoading: true, error: null });
                try {
                    await pocketBaseService.register(userData);
                    await get().login(userData.email, userData.password);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
                    set({ error: errorMessage });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            refreshUser: async () => {
                if (!get().user) return;
                
                set({ isLoading: true });
                try {
                    const userData = await pocketBaseService.refreshCurrentUser();
                    if (userData) {
                        const user: User = {
                            id: userData.id,
                            email: userData.email,
                            name: userData.name,
                            isAdmin: userData.isAdmin === true,
                            created: userData.created,
                            updated: userData.updated,
                            verified: userData.verified
                        };
                        set({ user, isAdmin: user.isAdmin });
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to refresh user';
                    set({ error: errorMessage });
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: () => {
                pocketBaseService.logout();
                set({ 
                    user: null, 
                    isAdmin: false, 
                    error: null 
                });
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ 
                user: state.user, 
                isAdmin: state.isAdmin 
            })
        }
    )
);
