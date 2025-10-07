import { create } from "zustand";

interface AuthState {
  token: string | null;
  climberId: string | null;
  setToken: (token: string | null) => void;
  setClimberId: (climberId: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  climberId: null,
  setToken: (token) => set({ token }),
  setClimberId: (climberId) => set({ climberId }),
}));
