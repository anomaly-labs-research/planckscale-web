"use client";

import { useEffect, useState } from "react";
import { NAV } from "@/site/lib/data";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive("#" + e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("section[id]").forEach((s) => obs.observe(s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <nav className={`top${scrolled ? " scrolled" : ""}`}>
      <div className="wrap">
        <a href="#top" className="brand" aria-label="PlanckScale home">
          <Logo />
          PLANCKSCALE
        </a>
        <div className={`links${open ? " open" : ""}`} id="links">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className={active === l.href ? "active" : undefined} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
        <ThemeToggle />
        <button
          className="icon-btn menu-btn"
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="links"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

