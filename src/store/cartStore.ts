'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';
import api from '@/lib/api';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode?: string;
  discount: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  removeItem: (sku: string) => void;
  clearCart: () => void;
  syncWithServer: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ discount: number; message?: string }>;
  removeCoupon: () => void;
  get subtotal(): number;
  get itemCount(): number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: undefined,
      discount: 0,

      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) => {
        const items = [...get().items];
        const idx = items.findIndex(i => i.variantSku === item.variantSku);
        if (idx > -1) {
          items[idx] = { ...items[idx], quantity: items[idx].quantity + item.quantity };
        } else {
          items.push(item);
        }
        set({ items, isOpen: true });
        api.post('/cart/add', {
          productId: item.product,
          variantSku: item.variantSku,
          quantity: item.quantity,
        }).catch(() => {});
      },

      updateQuantity: (sku, quantity) => {
        if (quantity <= 0) {
          get().removeItem(sku);
          return;
        }
        set({ items: get().items.map(i => i.variantSku === sku ? { ...i, quantity } : i) });
        api.put('/cart/update', { variantSku: sku, quantity }).catch(() => {});
      },

      removeItem: (sku) => {
        set({ items: get().items.filter(i => i.variantSku !== sku) });
        api.delete(`/cart/item/${sku}`).catch(() => {});
      },

      clearCart: () => {
        set({ items: [], discount: 0, couponCode: undefined });
      },

      syncWithServer: async () => {
        const { data } = await api.get('/cart');
        if (data.cart?.items) set({ items: data.cart.items });
      },

      applyCoupon: async (code) => {
        const subtotal = get().subtotal;
        const { data } = await api.post('/coupons/validate', { code, subtotal });
        set({ couponCode: code, discount: data.discount });
        return { discount: data.discount };
      },

      removeCoupon: () => set({ couponCode: undefined, discount: 0 }),
    }),
    {
      name: 'brivam-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
