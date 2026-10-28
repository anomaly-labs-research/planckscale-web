"use client";

import { useLayoutEffect, useState } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/** Stored choice wins, otherwise dark; mirrors the boot script. */
function resolveTheme(): Theme {
  try {
    if (localStorage.getItem(THEME_STORAGE_KEY) === "light") return "light";
  } catch {}
  return "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Re-apply after React's dev-mode remount clears <html> attributes.
  useLayoutEffect(() => {
    apply(resolveTheme());
  }, []);

  function apply(next: Theme) {
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
  }

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
    apply(next);
  }

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  return (
    <button type="button" onClick={toggle} aria-label={label} title={label} className="icon-btn theme-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4a8 8 0 000 16z" fill="currentColor" />
      </svg>
    </button>
  );
}
