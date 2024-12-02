import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { pb } from '../lib/pocketbase';
import { pocketBaseService } from '../services/PocketBaseService';
import { emailService } from '../services/EmailService';

export interface Order {
  id?: string;
  order_number: string;
  customer_email: string;
  items: string;
  subtotal: number;
  total: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'abandoned' | 'refunded';
  payment_provider: string;
  delivery_status: 'pending' | 'delivered' | 'failed';
  delivery_messages?: string;
  abandoned_cart_processed?: boolean;
  recovery_email_sent?: string;
  refunded_at?: string;
  created?: string;
  updated?: string;
}

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  createOrder: (order: Omit<Order, 'id' | 'created' | 'updated'>) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  processAbandonedCart: (orderId: string) => Promise<void>;
  sendDeliveryMessage: (orderId: string, itemIndex: number, message: string) => Promise<void>;
  processRefund: (orderId: string) => Promise<void>;
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
          const createdOrder = await pb.collection('store_orders').create({
            ...order,
            items: typeof order.items === 'string' ? order.items : JSON.stringify(order.items),
            delivery_messages: '[]',
            payment_status: 'pending',
            delivery_status: 'pending',
            abandoned_cart_processed: false,
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
          const updatedOrder = await pocketBaseService.updateOrder(id, updates);
          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === id ? updatedOrder : order
            ),
            currentOrder:
              state.currentOrder?.id === id ? updatedOrder : state.currentOrder,
          }));
          return updatedOrder;
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchAllOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const orders = await pocketBaseService.getOrders();
          set({ orders });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      processAbandonedCart: async (orderId: string) => {
        const order = get().orders.find(o => o.id === orderId);
        if (!order) throw new Error('Order not found');

        try {
          // Send recovery email
          await emailService.sendAbandonedCartEmail(order);

          // Mark cart as processed
          await get().updateOrder(orderId, {
            abandoned_cart_processed: true,
            recovery_email_sent: new Date().toISOString()
          });
        } catch (error: any) {
          throw new Error(`Failed to process abandoned cart: ${error.message}`);
        }
      },

      sendDeliveryMessage: async (orderId: string, itemIndex: number, message: string) => {
        const order = get().orders.find(o => o.id === orderId);
        if (!order) throw new Error('Order not found');

        try {
          // Parse items and get specific item
          const items = JSON.parse(order.items);
          const item = items[itemIndex];
          if (!item) throw new Error('Item not found');

          // Send delivery email for the specific item
          await emailService.sendDeliveryEmail(order, item, message);

          // Update order with delivery message
          const messages = order.delivery_messages ? JSON.parse(order.delivery_messages) : [];
          messages.push({
            timestamp: new Date().toISOString(),
            message,
            itemIndex
          });

          await get().updateOrder(orderId, {
            delivery_messages: JSON.stringify(messages),
            delivery_status: 'delivered'
          });
        } catch (error: any) {
          throw new Error(`Failed to send delivery message: ${error.message}`);
        }
      },

      processRefund: async (orderId: string) => {
        const order = get().orders.find(o => o.id === orderId);
        if (!order) throw new Error('Order not found');

        try {
          // Send refund confirmation email
          await emailService.sendRefundConfirmation(order);

          // Update order status
          await get().updateOrder(orderId, {
            payment_status: 'refunded',
            refunded_at: new Date().toISOString()
          });
        } catch (error: any) {
          throw new Error(`Failed to process refund: ${error.message}`);
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
