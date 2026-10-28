import type { Metadata, Viewport } from "next";
import { fontVars } from "@/lib/fonts";
import { NO_FLASH } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://planckscale.xyz"),
  title: "PlanckScale — Quantum, Cryptography & Distributed Trust",
  description:
    "PlanckScale builds infrastructure for the post-quantum transition: quantum computing, post-quantum cryptography, blockchain systems and DeFi.",
  openGraph: { type: "website", siteName: "PlanckScale", url: "https://planckscale.xyz" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#f4f4f2" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
