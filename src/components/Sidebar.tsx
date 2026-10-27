"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS, docsInSection } from "@/lib/manifest";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-8">
      {SECTIONS.map((section, i) => (
        <div key={section.id}>
          <p className="side-label">
            <b>{String(i + 1).padStart(2, "0")}</b> — {section.title}
          </p>
          <div className="side-nav">
            {docsInSection(section.id).map((doc) => {
              const href = `/docs/${doc.slug}`;
              return (
                <Link
                  key={doc.slug}
                  href={href}
                  onClick={onNavigate}
                  aria-current={pathname === href ? "page" : undefined}
                >
                  {doc.title}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="side hidden w-60 shrink-0 py-12 pr-2 lg:block">
      <NavList />
    </aside>
  );
}

/** Collapsible version for narrow screens, rendered above the article. */
export function MobileNav() {
  return (
    <details className="mobile-nav lg:hidden">
      <summary>
        Browse the handbook
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M8 3v10M3 8h10" />
        </svg>
      </summary>
      <div>
        <NavList />
      </div>
    </details>
  );
}
