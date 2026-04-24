"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      richColors
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "rounded-2xl border border-white/60 bg-white/90 text-slate-900 shadow-glow"
        }
      }}
    />
  );
}
