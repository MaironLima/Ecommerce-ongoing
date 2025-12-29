import { create } from "zustand";

interface TokenState {
  accessToken: string;
  setAccessToken: (token: string) => void
  clearAccesToken: () => void

  name: string;
  setName: (name: string) => void
  clearName: () => void
}

export const useStore = create<TokenState>((set) => ({
  accessToken:"",
  setAccessToken: (token) => set({accessToken: token}),
  clearAccesToken: () => set({ accessToken: "" }),

  name: "",
  setName: (name) => set({name: name}),
  clearName: () => set({ name: "" }),
}))