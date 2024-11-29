import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItemVariant {
  name: string;
  price: number;
  discountPercentage: number;
  billingCycle: 'monthly' | 'annual' | 'once';
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  image?: string;
  description?: string;
  variant?: CartItemVariant;
}

interface UserInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  userInfo: UserInfo | null;
  currentStep: number;
  total: number;
  highlightedItemId: string | null;
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setUserInfo: (info: UserInfo) => void;
  setCurrentStep: (step: number) => void;
  setHighlightedItemId: (id: string | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      userInfo: null,
      currentStep: 0,
      total: 0,
      highlightedItemId: null,

      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          item => item.id === product.id && 
          item.variant?.name === product.variant?.name
        );

        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.id === product.id && item.variant?.name === product.variant?.name
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true
          });
        } else {
          set({
            items: [...currentItems, { ...product, quantity: 1 }],
            isOpen: true
          });
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
      setUserInfo: (info) => set({ userInfo: info }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setHighlightedItemId: (id) => set({ highlightedItemId: id }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        userInfo: state.userInfo,
      }),
    }
  )
);