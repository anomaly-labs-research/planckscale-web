import Link from "next/link";
import type { DocMeta } from "@/lib/manifest";

export function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function DocCard({ doc, num, large = false }: { doc: DocMeta; num: string; large?: boolean }) {
  return (
    <Link href={`/docs/${doc.slug}`} className={`card reveal${large ? " large" : ""}`}>
      <span className="num">{num}</span>
      <h3>{doc.title}</h3>
      <p>{doc.blurb}</p>
      <span className="go">
        Read <Arrow />
      </span>
    </Link>
  );
}
