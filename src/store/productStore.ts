import { create } from 'zustand';
import { pocketBaseService } from '../services/PocketBaseService';
import { llmService } from '../services/LLMService';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    category: string;
    brand: string;
    variants: string;
    metadata: string;
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
    createProduct: (productName: string) => Promise<void>;
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
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
            set({ error: errorMessage, loading: false });
        }
    },

    createProduct: async (productName: string) => {
        set({ loading: true, error: null });
        try {
            const productData = await llmService.generateProductContent(productName);
            const newProduct = await pocketBaseService.createProduct(productData);
            
            set(state => ({ 
                products: [...state.products, newProduct],
                loading: false 
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
            set({ error: errorMessage, loading: false });
        }
    },

    deleteProduct: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await pocketBaseService.deleteProduct(id);
            set(state => ({
                products: state.products.filter(p => p.id !== id),
                loading: false,
                selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
            set({ error: errorMessage, loading: false });
        }
    },

    updateProduct: async (id: string, data: Partial<Product>) => {
        set({ loading: true, error: null });
        try {
            const updatedProduct = await pocketBaseService.updateProduct(id, data);
            set(state => ({
                products: state.products.map(p => p.id === id ? updatedProduct : p),
                loading: false,
                selectedProduct: state.selectedProduct?.id === id ? updatedProduct : state.selectedProduct
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
            set({ error: errorMessage, loading: false });
        }
    },

    getProduct: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const product = await pocketBaseService.getProduct(id);
            set({ selectedProduct: product, loading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
            set({ error: errorMessage, loading: false });
        }
    },

    setSelectedProduct: (product: Product | null) => {
        set({ selectedProduct: product });
    },

    clearError: () => {
        set({ error: null });
    }
}));
