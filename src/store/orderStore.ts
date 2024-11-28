import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './cartStore';
import { pb } from '../lib/pocketbase';

export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt?: string;
  updatedAt?: string;
  shippingAddress?: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  fetchOrders: (userId: string) => Promise<void>;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      isLoading: false,
      error: null,

      createOrder: async (order) => {
        set({ isLoading: true, error: null });
        try {
          const createdOrder = await pb.collection('orders').create({
            ...order,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
          });

          set((state) => ({
            orders: [...state.orders, createdOrder],
            currentOrder: createdOrder,
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateOrder: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const updatedOrder = await pb.collection('orders').update(id, {
            ...updates,
            updated: new Date().toISOString(),
          });

          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === id ? { ...order, ...updatedOrder } : order
            ),
            currentOrder:
              state.currentOrder?.id === id
                ? { ...state.currentOrder, ...updatedOrder }
                : state.currentOrder,
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchOrders: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const records = await pb.collection('orders').getList(1, 50, {
            filter: `userId = "${userId}"`,
            sort: '-created',
          });

          set({ orders: records.items });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null });
      },
    }),
    {
      name: 'order-storage',
    }
  )
);
