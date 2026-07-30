import { create } from "zustand";

interface TokenState {
  accessToken: string;
  setAccessToken: (token: string) => void;
  clearAccesToken: () => void;

  name: string;
  setName: (name: string) => void;
  clearName: () => void;

  category: string;
  setCategory: (category: string) => void;
  clearCategory: () => void;

  order: string;
  setOrderBy: (order: string) => void;
  clearOrderBy: () => void;

  appName: string;
}

export const useStore = create<TokenState>((set) => ({
  accessToken: localStorage.getItem("accessToken") ?? "",
  setAccessToken: (token) => {
    localStorage.setItem("accessToken", token);
    set({ accessToken: token });
  },
  clearAccesToken: () => {
    localStorage.removeItem("accessToken");
    set({ accessToken: "" });
  },

  name: "",
  setName: (name) => set({ name: name }),
  clearName: () => set({ name: "" }),

  category: "All",
  setCategory: (category) => set({ category: category }),
  clearCategory: () => set({ category: "" }),
  
  order: "Most Recent",
  setOrderBy: (orderBy) => set({ order: orderBy }),
  clearOrderBy: () => set({ order: "" }),

  appName: "Ecommerce",
}));
