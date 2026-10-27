"use client";

import { useEffect, useState } from "react";
import { NAV } from "@/lib/data";

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

  const flipTheme = () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try {
      localStorage.setItem("ps-theme", root.dataset.theme);
    } catch {}
  };

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
        <button className="icon-btn" id="theme" type="button" onClick={flipTheme} aria-label="Toggle light and dark theme">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 4a8 8 0 000 16z" fill="currentColor" />
          </svg>
        </button>
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

// ħ (reduced Planck constant) drawn as strokes inside a square.
export function Logo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" strokeWidth="2.4" />
      <path d="M12.6 5.4 8.6 18.6M9.7 15c1-3 2.6-4.6 4.4-4.6 1.3 0 1.8.9 1.4 2.3l-1.1 3.6c-.4 1.3.1 2 .9 2 .7 0 1.3-.5 1.9-1.4M8.9 9.6l5.6-2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" transform="translate(-0.9 0)" />
    </svg>
  );
}
