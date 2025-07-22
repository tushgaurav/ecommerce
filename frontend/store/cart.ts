import { create } from "zustand";
import api from "@/lib/api";
import { CartItem } from "@/types";

interface CartState {
  cart: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCart: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/cart/");
      set({ cart: response.data.results || response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Failed to fetch cart:", error);
    }
  },

  addToCart: async (productId: number, quantity = 1) => {
    set({ loading: true });
    try {
      await api.post("/cart/add/", { product_id: productId, quantity });
      await get().fetchCart();
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateCart: async (itemId: number, quantity: number) => {
    set({ loading: true });
    try {
      await api.put(`/cart/${itemId}/`, { quantity });
      await get().fetchCart();
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  removeFromCart: async (itemId: number) => {
    set({ loading: true });
    try {
      await api.delete(`/cart/${itemId}/delete/`);
      await get().fetchCart();
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  clearCart: () => {
    set({ cart: [] });
  },

  get totalAmount() {
    return get().cart.reduce(
      (total, item) => total + parseFloat(item.total_price),
      0
    );
  },

  get totalItems() {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },
}));
