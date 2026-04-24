import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { PwaRegister } from "@/components/providers/pwa-register";
import { AppToaster } from "@/components/providers/toaster";
import { clerkAppearance } from "@/lib/clerk";
import { hasClerkEnv } from "@/lib/env";
import "@/app/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "GarageFlow",
  description: "Production-ready garage rent, advance, and electricity management.",
  applicationName: "GarageFlow",
  icons: {
    icon: [{ url: "/icon-512.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "512x512", type: "image/png" }],
    shortcut: ["/icon-512.png"]
  }
};

export const viewport: Viewport = {
  themeColor: "#0f172a"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const app = (
    <>
      <PwaRegister />
      {children}
      <AppToaster />
    </>
  );

  return (
    <html lang="en">
      <body className={`${manrope.variable} ${spaceGrotesk.variable}`}>
        {hasClerkEnv() ? (
          <ClerkProvider appearance={clerkAppearance} dynamic afterSignOutUrl="/">
            {app}
          </ClerkProvider>
        ) : (
          app
        )}
      </body>
    </html>
  );
}
