import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { PwaRegister } from "@/components/providers/pwa-register";
import { AppToaster } from "@/components/providers/toaster";
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
    icon: "/logo-mark.svg",
    apple: "/logo-mark.svg"
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
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${spaceGrotesk.variable}`}>
        <PwaRegister />
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
