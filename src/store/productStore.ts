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
    featured: number;
    image?: string;
    images?: string;
    metadata?: string;
    variants: string;
    isAvailable: number;
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
            const variants = JSON.parse(product.variants || '[]');
            const validatedVariants = variants.map((variant: any) => ({
                ...variant,
                id: variant.id || llmService.generateVariantId()
            }));

            // For new products, always set featured and isAvailable to 0
            const cleanData = {
                ...product,
                variants: JSON.stringify(validatedVariants),
                isAvailable: 0,
                featured: 0
            };

            const newProduct = await pocketBaseService.createProduct(cleanData);
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
            // For updates, keep the existing values if not provided
            const existingProduct = get().products.find(p => p.id === id);
            if (!existingProduct) {
                throw new Error('Product not found');
            }

            // Only update featured and isAvailable if they are explicitly provided
            const cleanData = {
                ...data,
                featured: data.featured ?? existingProduct.featured,
                isAvailable: data.isAvailable ?? existingProduct.isAvailable
            };

            const updatedProduct = await pocketBaseService.updateProduct(id, cleanData);
            const products = get().products.map(p => 
                p.id === id ? { ...p, ...updatedProduct } : p
            );
            set({ products, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
            throw error;
        }
    },

    getProduct: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const product = await pocketBaseService.getProduct(id);
            if (!product) {
                throw new Error(`Product with ID ${id} not found`);
            }
            set({ selectedProduct: product, loading: false });
            return product;
        } catch (error) {
            set({ error: (error as Error).message, loading: false, selectedProduct: null });
            throw error;
        }
    },

    setSelectedProduct: (product: Product | null) => set({ selectedProduct: product }),

    clearError: () => set({ error: null })
}));
