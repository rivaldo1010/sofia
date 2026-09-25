import { create } from "zustand";
import { API_URL } from "../lib/api";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  phone?: string | null;
  role: "CUSTOMER" | "ADMIN";
};

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  check: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  check: async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
await fetch(`${API_URL}/auth/logout`, {
        const user = await res.json();
        set({ user, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch {
      set({ user: null, loading: false });
    }
  },
  logout: async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    set({ user: null });
  },
}));