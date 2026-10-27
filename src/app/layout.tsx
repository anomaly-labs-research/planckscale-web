import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/Disclaimer";
import { DEFAULT_MODE, MODE_BOOT_SCRIPT } from "@/lib/modes";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Solana MEV Handbook", template: "%s · Solana MEV Handbook" },
  description:
    "Strategy explainers and market-structure notes for MEV and trading on Solana: arbitrage, liquidations, JIT, market making, block building and more.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#f4f4f2" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Boot scripts set data-mode and data-theme from localStorage before paint; React keeps the DOM's values.
    <html
      lang="en"
      data-mode={DEFAULT_MODE}
      data-theme="dark"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrains.variable} ${inter.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MODE_BOOT_SCRIPT + ";" + THEME_BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-svh flex-col">
        <Header />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
