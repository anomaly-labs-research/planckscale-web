import Link from "next/link";

/** Site-wide disclaimer, shown once in the footer instead of on every page. */
export function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="eyebrow mb-5">Not advice</div>
        <p className="foot-note">
          <b>Not advice, and not guaranteed accurate.</b> The Solana MEV Handbook is educational
          research. Figures are dated September 2026, claims marked (unverified) lack a primary source,
          and errors are possible. Nothing here is investment, financial, legal or tax advice.{" "}
          <Link href="/mev/disclaimer">Read the full disclaimer</Link>
        </p>
        <div className="planck" aria-hidden="true">
          ℓ<sub style={{ fontSize: ".4em" }}>P</sub> = √(ħG/c³)
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} <Link href="/">PlanckScale</Link> · Solana MEV Handbook</span>
          <span>1.616 × 10⁻³⁵ m</span>
        </div>
      </div>
    </footer>
  );
}
