import { create } from "zustand";
import { API_URL } from "../lib/api";

type Config = {
  whatsappNumber: string | null;
  storeName: string;
  currency: string;
  loading: boolean;
  loaded: boolean;
  load: () => Promise<void>;
};

export const useConfig = create<Config>((set) => ({
  whatsappNumber: null,
  storeName: "Sofía",
  currency: "USD",
  loading: false,
  loaded: false,
  load: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/config`);
      if (res.ok) {
        const data = await res.json();
        set({
          whatsappNumber: data.whatsappNumber,
          storeName: data.storeName,
          currency: data.currency,
          loaded: true,
        });
      }
    } catch {
      // silencio
    } finally {
      set({ loading: false });
    }
  },
}));

// Helper para armar el link de WhatsApp
export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}