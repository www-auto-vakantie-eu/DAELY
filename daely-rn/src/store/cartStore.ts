import create from 'zustand';

export type CartItemType = 'challenge' | 'clothing' | 'supplement' | 'dish';

export interface CartItem {
  id: string;
  type: CartItemType;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  meta?: Record<string, any>; // Voor extra info per type
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id && i.type === item.type);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === item.id && i.type === item.type
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    });
  },
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clearCart: () => set({ items: [] }),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
