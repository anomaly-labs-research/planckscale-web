"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { ModeSwitch } from "./ModeSwitch";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/docs/strategies", label: "Strategies" },
  { href: "/docs/state-of-solana-mev", label: "State of MEV" },
  { href: "/docs/solana-block-building", label: "Block building" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <nav className="top">
      <div className="bar">
        <Link href="/" className="brand" aria-label="Solana MEV Handbook home">
          <Logo />
          PLANCKSCALE<span>/ MEV</span>
        </Link>
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
