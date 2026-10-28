import type { ReactNode } from "react";
import Link from "next/link";
import Nav from "@/site/components/Nav";
import Lattice from "@/site/components/Lattice";
import Reveal from "@/components/Reveal";
import Platform from "@/site/components/Platform";
import Explorer from "@/site/components/Explorer";
import Mosca from "@/site/components/Mosca";
import { PROBLEMS, SHOW } from "@/site/lib/data";

function SectionHead({ num, label, title, children }: { num: string; label: string; title: ReactNode; children: ReactNode }) {
  return (
    <div className="sec-head reveal">
      <div>
        <div className="eyebrow"><b>{num}</b> — {label}</div>
        <h2>{title}</h2>
      </div>
      <p>{children}</p>
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

const FOCUS = [
  {
    num: "I / QUANTUM", title: "Quantum computing",
    body: "We build cryptanalytic resource estimates — logical qubits, gate depth, error-correction overhead — that turn \"Q-Day\" from a headline into an engineering date.",
    items: ["Shor & Grover cost models", "Error-correction budgets", "Threat-horizon tracking"],
    glyph: (
      <>
        <circle cx="44" cy="44" r="36" />
        <ellipse cx="44" cy="44" rx="36" ry="11" />
        <path d="M44 8v72" strokeDasharray="2 3" />
        <path d="M44 44l18-24" strokeWidth="1.6" />
        <circle cx="62" cy="20" r="3" fill="currentColor" />
      </>
    ),
  },
  {
    num: "II / CRYPTOGRAPHY", title: "Cryptography",
    body: "Lattice and hash-based schemes in the places they are hardest to deploy: constrained devices, HSMs, firmware trust chains and high-throughput links.",
    items: ["Constant-time PQC in Rust", "Embedded & FPGA acceleration", "Crypto-agility protocols"],
    glyph: (
      <>
        <g fill="currentColor" stroke="none">
          {[0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((c) => (
            <circle key={`${r}${c}`} cx={14 - r * 4 + c * 20} cy={14 + r * 22 + c * 6} r="2" />
          )))}
        </g>
        <path d="M30 42l20 6M30 42l-4 22" strokeWidth="1.6" />
        <circle cx="30" cy="42" r="6" />
      </>
    ),
  },
  {
    num: "III / DECENTRALIZED SYSTEMS & DEFI", title: "Decentralized systems & DeFi",
    body: "Ledgers, consensus and on-chain markets that must change their cryptography without stopping. We design migrations that keep state, funds and liveness intact, and study how value moves through block building and DeFi.",
    items: ["PQ signatures on-chain", "Validator & key infrastructure", <Link key="mev" href="/mev/">MEV &amp; execution research</Link>],
    glyph: (
      <>
        <rect x="6" y="30" width="22" height="28" />
        <rect x="33" y="30" width="22" height="28" />
        <rect x="60" y="30" width="22" height="28" strokeDasharray="3 2" />
        <path d="M28 44h5M55 44h5" />
        <path d="M12 38h10M12 44h6M39 38h10M39 44h6" strokeWidth="1.6" />
        <path d="M66 38h10M66 44h6" strokeWidth="1.6" strokeDasharray="2 2" />
      </>
    ),
  },
];

export default function Home() {
  return (
    <>
      <Nav />
      <Reveal />

      <header className="hero" id="top">
        <Lattice />
        <div className="wrap">
          <div className="eyebrow"><span className="status-dot" />Research &amp; Development</div>
          <h1>Hard problems at the <em>edge</em> of computation.</h1>
          <p className="hero-lede">
            PlanckScale is a research and development firm working across quantum computing, cryptography, decentralized
            systems and DeFi. We take hard results out of papers and ship them as production-grade infrastructure.
          </p>
          <div className="hero-actions">
            {SHOW.work
              ? <a href="#work" className="btn solid">See our work <Arrow /></a>
              : <a href="#focus" className="btn solid">Our focus <Arrow /></a>}
            {SHOW.problems && <a href="#problems" className="btn">Open problems</a>}
          </div>
        </div>
      </header>

      <section id="focus">
        <div className="wrap">
          <SectionHead num="01" label="Focus" title={<>Three fields.<br />One frontier.</>}>
            Quantum computers will break the public-key cryptography beneath TLS, PKI, firmware and every major ledger. The
            replacement algorithms exist. The unsolved work is everything around them — that is our lab bench.
          </SectionHead>
          <div className="pillars">
            {FOCUS.map((p) => (
              <article key={p.title} className="pillar reveal">
                <span className="num">{p.num}</span>
                <svg className="glyph" viewBox="0 0 88 88" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">{p.glyph}</svg>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <ul>{p.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {SHOW.work && <section id="work">
        <div className="wrap">
          <SectionHead num="02" label="Work" title={<>From paper<br />to production.</>}>
            Every project starts as a research question and ends as software or hardware that runs under real load. Some are
            in the lab; some are already shipping.
          </SectionHead>
          <Platform />
        </div>
      </section>}

      {SHOW.problems && <section id="problems">
        <div className="wrap">
          <SectionHead num="03" label="Open problems" title={<>Questions we<br />are working on.</>}>
            The problems we think matter most over the next decade. If one of these keeps you up at night, we should talk.
          </SectionHead>
          <ol className="problems">
            {PROBLEMS.map((p, i) => (
              <li key={p.q} className="problem reveal">
                <span className="p-num">Q.{String(i + 1).padStart(2, "0")}</span>
                <div><h3>{p.q}</h3><p>{p.detail}</p></div>
                <span className="p-tag">{p.area}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>}

      {SHOW.instruments && <section id="instruments">
        <div className="wrap">
          <SectionHead num="04" label="Instruments" title={<>What breaks,<br />what replaces it.</>}>
            Small tools from the lab. Shor&apos;s algorithm breaks RSA and elliptic curves outright; Grover&apos;s halves
            symmetric security. Select an algorithm to see its status and the byte cost of its replacement.
          </SectionHead>
          <Explorer />
          <div className="spacer" />
          <div className="sec-head sub reveal">
            <div>
              <div className="eyebrow">Harvest now, decrypt later</div>
              <h3>Mosca&apos;s inequality, live.</h3>
            </div>
            <p>
              Adversaries record encrypted traffic today and decrypt it once a cryptographically relevant quantum computer
              exists. If secrets must outlive that day, you are already late.
            </p>
          </div>
          <Mosca />
        </div>
      </section>}

      <footer>
        <div className="wrap">
          <div className="planck" aria-hidden="true">ℓ<sub style={{ fontSize: ".4em" }}>P</sub> = √(ħG/c³)</div>
          <div className="foot-bottom"><span>© {new Date().getFullYear()} PlanckScale</span><span>1.616 × 10⁻³⁵ m</span></div>
        </div>
      </footer>
    </>
  );
}
