/**
 * Глобальный стейт корзины на Zustand.
 * Персистентность через localStorage — только на клиенте (SSR-safe).
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Элемент корзины с минимальным набором полей для UI и checkout */
export interface CartItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

/** Публичный интерфейс store корзины */
interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      /** Добавить товар или увеличить количество, если уже в корзине */
      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { ...item, quantity }],
            isOpen: true,
          };
        });
      },

      /** Удалить позицию из корзины по productId */
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      /** Обновить количество; при quantity <= 0 — удалить позицию */
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        }));
      },

      /** Полностью очистить корзину (после успешного заказа) */
      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      /** Сумма всех позиций корзины */
      getTotalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      /** Общее количество единиц товара */
      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'chocolat-cart',
      /** Не персистим состояние открытия slide-over */
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
