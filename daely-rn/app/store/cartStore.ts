import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const CART_STORAGE_KEY = 'daely.commerce.cart.v1';

export type CartItemType = 'challenge' | 'clothing' | 'supplement' | 'dish' | 'accessory' | 'essential';

export interface CartItem {
  id: string;
  type: CartItemType;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  partnerId?: string;
  partnerName?: string;
  meta?: Record<string, any>; // Voor extra info per type
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  total: () => number;
  _hydrate: () => Promise<void>;
}

async function loadCartFromStorage(): Promise<CartItem[]> {
  try {
    const raw = await AsyncStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveCartToStorage(items: CartItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id && i.type === item.type);
      let newItems: CartItem[];
      if (exists) {
        newItems = state.items.map((i) =>
          i.id === item.id && i.type === item.type
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newItems = [...state.items, item];
      }
      saveCartToStorage(newItems);
      return { items: newItems };
    });
  },
  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      saveCartToStorage(newItems);
      return { items: newItems };
    });
  },
  clearCart: () => {
    set({ items: [] });
    saveCartToStorage([]);
  },
  updateQuantity: (id, quantity) => {
    set((state) => {
      const newItems = state.items.map((i) => (i.id === id ? { ...i, quantity } : i));
      saveCartToStorage(newItems);
      return { items: newItems };
    });
  },
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  _hydrate: async () => {
    const items = await loadCartFromStorage();
    set({ items });
  },
}));
