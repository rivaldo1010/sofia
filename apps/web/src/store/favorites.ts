import { create } from "zustand";

type FavoritesState = {
  ids: string[];
  loading: boolean;
  loaded: boolean;
  load: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
  has: (productId: string) => boolean;
  clear: () => void;
};

export const useFavorites = create<FavoritesState>((set, get) => ({
  ids: [],
  loading: false,
  loaded: false,
  load: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/favorites/ids", { credentials: "include" });
      if (res.ok) {
        const ids = await res.json();
        set({ ids, loaded: true });
      } else {
        set({ ids: [], loaded: true });
      }
    } catch {
      set({ ids: [], loaded: true });
    } finally {
      set({ loading: false });
    }
  },
  toggle: async (productId) => {
    const current = get().ids;
    const isFav = current.includes(productId);

    if (isFav) {
      set({ ids: current.filter((id) => id !== productId) });
    } else {
      set({ ids: [...current, productId] });
    }

    try {
      const res = await fetch(`/api/favorites/${productId}`, {
        method: isFav ? "DELETE" : "POST",
        credentials: "include",
      });

      if (!res.ok) {
        set({ ids: current });
      }
    } catch {
      set({ ids: current });
    }
  },
  has: (productId) => get().ids.includes(productId),
  clear: () => set({ ids: [], loaded: false }),
}));