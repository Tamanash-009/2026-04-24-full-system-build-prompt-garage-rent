export const clerkAppearance = {
  variables: {
    colorPrimary: "#0f172a",
    colorText: "#0f172a",
    colorTextSecondary: "#475569",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#0f172a",
    colorNeutral: "#e2e8f0",
    borderRadius: "1rem",
    fontFamily: "var(--font-sans)"
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full",
    card: "w-full max-w-xl rounded-[2rem] border border-white/60 bg-white/80 p-0 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl",
    headerTitle: "font-display text-3xl font-semibold text-slate-950",
    headerSubtitle: "text-slate-600",
    socialButtonsBlockButton:
      "h-11 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-none transition hover:border-cyan-200 hover:bg-cyan-50",
    socialButtonsBlockButtonText: "text-sm font-semibold",
    formFieldInput:
      "h-11 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-none focus:border-cyan-400 focus:ring-0",
    formFieldLabel: "text-sm font-medium text-slate-700",
    formButtonPrimary:
      "h-11 rounded-2xl bg-slate-950 text-white shadow-none transition hover:bg-slate-800",
    footerActionLink: "font-semibold text-cyan-800 hover:text-cyan-900",
    dividerLine: "bg-slate-200",
    dividerText: "text-slate-500",
    alertText: "text-sm",
    identityPreviewText: "text-slate-700",
    identityPreviewEditButton: "text-cyan-800 hover:text-cyan-900"
  }
} as const;
