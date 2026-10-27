import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DOCS, SECTIONS, getDocMeta, loadDoc, neighbours } from "@/lib/content";
import { MobileNav, Sidebar } from "@/components/Sidebar";
import { Toc } from "@/components/Toc";
import { ModeNotice } from "@/components/ModeNotice";

export const dynamicParams = false;

export function generateStaticParams() {
  return DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const meta = getDocMeta(slug);
  if (!meta) return {};
  return { title: meta.title, description: meta.blurb };
}

export default async function DocPage({ params }: PageProps<"/docs/[slug]">) {
  const { slug } = await params;
  const doc = await loadDoc(slug);
  if (!doc) notFound();

  const sectionIndex = SECTIONS.findIndex((s) => s.id === doc.section);
  const { prev, next } = neighbours(slug);

  return (
    <div className="docs-shell">
      <Sidebar />
      <main className="min-w-0 flex-1 py-10 lg:py-14">
        <MobileNav />
        <article className="mx-auto max-w-3xl">
          <header className="doc-head">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">
                <b>{String(sectionIndex + 1).padStart(2, "0")}</b> — {SECTIONS[sectionIndex]?.title}
              </span>
              {doc.asOf && <span className="chip">{doc.asOf}</span>}
            </div>
            <h1>{doc.h1 ?? doc.title}</h1>
            <p>{doc.blurb}</p>
          </header>

          <ModeNotice toc={doc.toc} />

          <div className="doc" dangerouslySetInnerHTML={{ __html: doc.html }} />

          <nav className="pager" aria-label="Pagination">
            {prev ? (
              <Link href={`/docs/${prev.slug}`}>
                <small>← Previous</small>
                <strong>{prev.title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/docs/${next.slug}`} className="text-right">
                <small>Next →</small>
                <strong>{next.title}</strong>
              </Link>
            )}
          </nav>
        </article>
      </main>
      <aside className="side hidden w-56 shrink-0 py-14 xl:block">
        <Toc entries={doc.toc} />
      </aside>
    </div>
  );
}
