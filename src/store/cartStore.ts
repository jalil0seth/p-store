import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  image?: string;
  description?: string;
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
        const existingItem = currentItems.find(item => item.id === product.id);

        let newItems;
        if (existingItem) {
          newItems = currentItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newItems = [...currentItems, { ...product, quantity: 1 }];
        }

        const total = newItems.reduce((sum, item) => {
          const itemPrice = item.discount 
            ? item.price * (1 - item.discount / 100)
            : item.price;
          return sum + itemPrice * item.quantity;
        }, 0);

        set({
          items: newItems,
          total,
          isOpen: true,
          highlightedItemId: product.id,
          currentStep: 0
        });

        // Clear highlight after 2 seconds
        setTimeout(() => {
          set({ highlightedItemId: null });
        }, 2000);
      },

      removeItem: (id) => {
        const newItems = get().items.filter(item => item.id !== id);
        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        set({ items: newItems, total });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }

        const newItems = get().items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );

        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        set({ items: newItems, total });
      },

      clearCart: () => set({ items: [], total: 0 }),
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
        total: state.total
      })
    }
  )
);