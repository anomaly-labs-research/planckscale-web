import type { Metadata } from "next";
import Link from "next/link";
import { fontVars } from "@/lib/fonts";
import { NO_FLASH } from "@/lib/theme";
import "./(site)/globals.css";

export const metadata: Metadata = { title: "Not found — PlanckScale" };

// Two root layouts ((site) and (mev)), so unmatched URLs render this page outside both.
export default function GlobalNotFound() {
  return (
    <html lang="en" data-theme="dark" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
      </head>
      <body>
        <section className="nf">
          <div className="wrap">
            <div className="eyebrow">404 — Below the Planck scale</div>
            <h1>Nothing here.</h1>
            <p style={{ margin: "24px 0 32px" }}>This page is smaller than anything we can measure.</p>
            <Link href="/" className="btn solid">Back to PlanckScale</Link>
          </div>
        </section>
      </body>
    </html>
  );
}
