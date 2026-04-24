"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppStore {
  paymentSearch: string;
  tenancySearch: string;
  lastRealtimeSyncAt: string | null;
  setPaymentSearch: (value: string) => void;
  setTenancySearch: (value: string) => void;
  touchRealtimeSync: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      paymentSearch: "",
      tenancySearch: "",
      lastRealtimeSyncAt: null,
      setPaymentSearch: (value) => set({ paymentSearch: value }),
      setTenancySearch: (value) => set({ tenancySearch: value }),
      touchRealtimeSync: () => set({ lastRealtimeSyncAt: new Date().toISOString() })
    }),
    {
      name: "garageflow-ui"
    }
  )
);
