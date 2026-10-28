import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVars } from "@/lib/fonts";
import { Header } from "@/mev/components/Header";
import { SiteFooter } from "@/mev/components/Disclaimer";
import { DEFAULT_MODE, MODE_BOOT_SCRIPT } from "@/mev/lib/modes";
import { NO_FLASH } from "@/lib/theme";

export const metadata: Metadata = {
  metadataBase: new URL("https://planckscale.xyz"),
  title: {
    default: "Solana MEV Handbook — PlanckScale",
    template: "%s · Solana MEV Handbook — PlanckScale",
  },
  description:
    "Strategy explainers and market-structure notes for MEV and trading on Solana: arbitrage, liquidations, JIT, market making, block building and more.",
  // No url here: child pages inherit openGraph, so a fixed url would point every doc at /mev.
  openGraph: { type: "website", siteName: "PlanckScale" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#f4f4f2" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/mev">) {
  return (
    // Boot scripts set data-mode and data-theme from localStorage before paint; React keeps the DOM's values.
    <html
      lang="en"
      data-mode={DEFAULT_MODE}
      data-theme="dark"
      suppressHydrationWarning
      className={fontVars}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MODE_BOOT_SCRIPT + ";" + NO_FLASH }} />
      </head>
      <body className="flex min-h-svh flex-col">
        <Header />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
