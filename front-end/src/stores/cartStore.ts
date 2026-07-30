import { create } from "zustand";
import privateAPI from "@/services/api/privateApi";

export interface CartItem {
  id: string;
  cart_id: string;
  variant_id: string;
  quantity: number;
  unit_price_snapshot: number;
  variant_sync: {
    id: string;
    attributes: Record<string, string> | null;
    price_override: number | null;
    stock: number;
    product_id: string;
  };
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearLocal: () => void;
  totalCount: () => number;
  totalValue: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await privateAPI.get("/cart");
      set({ items: (data?.cart_item ?? []) as CartItem[], loading: false });
    } catch (e: any) {
      set({
        loading: false,
        error: e?.response?.data?.error ?? "Failed to load cart",
      });
    }
  },

  addToCart: async (variantId: string, quantity = 1) => {
    await privateAPI.post("/cart", { variant_id: variantId, quantity });
    await get().fetchCart();
  },

  updateItem: async (itemId: string, quantity: number) => {
    await privateAPI.put(`/cart/${itemId}`, { quantity });
    await get().fetchCart();
  },

  removeItem: async (itemId: string) => {
    await privateAPI.delete(`/cart/${itemId}`);
    await get().fetchCart();
  },

  clearLocal: () => set({ items: [], error: null }),

  totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalValue: () =>
    get().items.reduce(
      (sum, i) => sum + i.unit_price_snapshot * i.quantity,
      0,
    ),
}));