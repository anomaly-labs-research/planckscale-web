import type { ReactNode } from "react";
import Link from "next/link";
import { DOCS, SECTIONS, docsInSection } from "@/mev/lib/manifest";
import { Arrow, DocCard } from "@/mev/components/DocCard";
import { ModePicker } from "@/mev/components/ModePicker";
import Reveal from "@/components/Reveal";
import { SlotStream } from "@/mev/components/SlotStream";

function SectionHead({ num, label, title, children }: { num: string; label: string; title: ReactNode; children: ReactNode }) {
  return (
    <div className="sec-head reveal">
      <div>
        <div className="eyebrow">
          <b>{num}</b> — {label}
        </div>
        <h2>{title}</h2>
      </div>
      <p>{children}</p>
    </div>
  );
}

const TITLES: Record<string, ReactNode> = {
  overview: <>The map,<br />then the market.</>,
  strategies: <>One explainer<br />per strategy.</>,
  infrastructure: <>Who orders<br />the block.</>,
};

export default function Home() {
  const prefix = (id: string) => id.slice(0, 1).toUpperCase();
  return (
    <main className="flex-1">
      <Reveal />

      <header className="hero">
        <SlotStream />
        <div className="wrap">
          <div className="eyebrow">
            <span className="status-dot" />
            Solana · as of September 2026
          </div>
          <h1>
            Solana MEV, <em>strategy by strategy.</em>
          </h1>
          <p className="hero-lede">
            What each on-chain trading strategy is, how the math works, what it looks like on Solana, and
            where the edge has moved. Researched from primary sources, with every unconfirmed claim marked.
          </p>
          <div className="hero-actions">
            <Link href="/mev/strategy-landscape" className="btn solid">
              Start with the landscape <Arrow />
            </Link>
            <Link href="/mev/state-of-solana-mev" className="btn">
              State of MEV on Solana
            </Link>
          </div>
          <dl className="stats">
            {[
              [String(DOCS.length), "Explainers"],
              [String(docsInSection("strategies").length), "Strategies"],
              ["250+", "Sources cited"],
              ["~200 ms", "Slot time, approaching"],
            ].map(([n, label]) => (
              <div key={label}>
                <dt>{n}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section className="sec">
        <div className="wrap">
          <SectionHead num="00" label="Reading level" title={<>Pick how<br />deep to go.</>}>
            Every explainer is written in three layers. Choose a reading level once and each page shows
            only what fits it; switch any time from the header.
          </SectionHead>
          <ModePicker />
        </div>
      </section>

      {SECTIONS.map((section, i) => {
        const docs = docsInSection(section.id);
        const large = section.id === "overview" || docs.length === 1;
        // Size columns to the doc count so the joined grid never has a half-empty row.
        const cols = docs.length === 1 ? "" : large || docs.length % 3 !== 0 ? "cols-2" : "cols-3";
        return (
          <section key={section.id} className="sec">
            <div className="wrap">
              <SectionHead num={String(i + 1).padStart(2, "0")} label={section.title} title={TITLES[section.id]}>
                {section.tagline}
              </SectionHead>
              <div className={`grid-cards ${cols}`}>
                {docs.map((d, j) => (
                  <DocCard
                    key={d.slug}
                    doc={d}
                    large={large}
                    num={`${prefix(section.id)}.${String(j + 1).padStart(2, "0")}`}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}
