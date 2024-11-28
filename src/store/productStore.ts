import { create } from 'zustand';
import { pocketBaseService } from '../services/PocketBaseService';
import { llmService } from '../services/LLMService';

interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    type: string;
    category: string;
    brand: string;
    featured: boolean;
    image?: string;
    images?: string;
    metadata?: string;
    variants: string;
    isAvailable: boolean;
    created?: string;
    updated?: string;
    collectionId?: string;
    collectionName?: string;
}

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    selectedProduct: Product | null;
}

interface ProductActions {
    fetchProducts: (filter?: string) => Promise<void>;
    createProduct: (product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
    getProduct: (id: string) => Promise<void>;
    setSelectedProduct: (product: Product | null) => void;
    clearError: () => void;
}

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    loading: false,
    error: null,
    selectedProduct: null,

    fetchProducts: async (filter = '') => {
        set({ loading: true, error: null });
        try {
            const products = await pocketBaseService.getProducts(filter);
            set({ products, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },

    createProduct: async (product: Partial<Product>) => {
        set({ loading: true, error: null });
        try {
            const newProduct = await pocketBaseService.createProduct(product);
            const products = get().products;
            set({ products: [...products, newProduct], loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },

    deleteProduct: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await pocketBaseService.deleteProduct(id);
            const products = get().products.filter(product => product.id !== id);
            set({ products, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },

    updateProduct: async (id: string, data: Partial<Product>) => {
        set({ loading: true, error: null });
        try {
            const updatedProduct = await pocketBaseService.updateProduct(id, data);
            const products = get().products.map(product =>
                product.id === id ? { ...product, ...updatedProduct } : product
            );
            set({ products, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },

    getProduct: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const product = await pocketBaseService.getProduct(id);
            set({ selectedProduct: product, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },

    setSelectedProduct: (product: Product | null) => set({ selectedProduct: product }),

    clearError: () => set({ error: null })
}));
