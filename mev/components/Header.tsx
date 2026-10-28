"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ModeSwitch } from "./ModeSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { href: "/mev/strategy-landscape", label: "Strategies" },
  { href: "/mev/state-of-solana-mev", label: "State of MEV" },
  { href: "/mev/solana-block-building", label: "Block building" },
  { href: "/mev/disclaimer", label: "Disclaimer" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <nav className="top">
      <div className="bar">
        {/* Mark and wordmark go to the main site (a full load, other root layout); "/ MEV" to the handbook home. */}
        <div className="brand">
          <Link href="/" aria-label="PlanckScale home">
            <Logo />
            <b>PLANCKSCALE</b>
          </Link>
          <Link href="/mev" className="brand-sub" aria-label="Solana MEV Handbook home">/ MEV</Link>
        </div>
        <div className="links">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="nav-tools">
          <ModeSwitch />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
