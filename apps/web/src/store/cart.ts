import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string, color: string, size: string) => void;
  updateQty: (productId: string, color: string, size: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const idx = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.color === item.color &&
              i.size === item.size
          );
          if (idx >= 0) {
            const items = [...state.items];
            items[idx].quantity = Math.min(
              items[idx].quantity + item.quantity,
              item.stock
            );
            return { items };
          }
          return { items: [...state.items, item] };
        }),
      remove: (productId, color, size) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(i.productId === productId && i.color === color && i.size === size)
          ),
        })),
      updateQty: (productId, color, size, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.color === color && i.size === size
              ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock)) }
              : i
          ),
        })),
      clear: () => set({ items: [] }),
      total: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      count: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: "Sofía-cart-v1" }
  )
);