"use client";

import { useState } from "react";

const SPAN = 50;
const pct = (yrs: number) => `${Math.max(0, Math.min(100, (yrs / SPAN) * 100))}%`;
const plural = (n: number) => `${n} year${n === 1 ? "" : "s"}`;

const SLIDERS = [
  { key: "x", min: 1, max: 40, label: "x — How long must data stay secret?", hint: "Health records, state secrets and root keys often need 25+ years." },
  { key: "y", min: 1, max: 15, label: "y — How long will migration take?", hint: "Large enterprises typically estimate 5–10 years end to end." },
  { key: "z", min: 3, max: 30, label: "z — Years until a CRQC exists?", hint: "Expert surveys cluster in the 10–20 year range; nobody knows." },
] as const;

// Mosca's inequality: data is at risk iff x + y > z.
export default function Mosca() {
  const [v, setV] = useState({ x: 10, y: 5, z: 10 });
  const { x, y, z } = v;
  const now = new Date().getFullYear();
  const end = x + y, gap = z - end;
  const state = gap < 0 ? "risk" : gap <= 3 ? "tight" : "ok";
  const cmp = end > z ? ">" : "≤";

  const text =
    state === "risk"
      ? `Data encrypted today stays exposed for ${plural(-gap)} after a quantum computer arrives. Traffic being recorded now is already compromised in the future.`
      : state === "tight"
        ? `Only ${plural(gap)} of margin. Any slip in migration pushes your secrets past the quantum horizon.`
        : `${plural(gap)} of margin. Start now anyway — migrations slip, and estimates of z only move earlier.`;

  return (
    <div className="mosca reveal">
      <div className="mosca-controls">
        {SLIDERS.map((s) => (
          <div key={s.key} className="slider">
            <label htmlFor={s.key}>
              <span>{s.label}</span>
              <output>{v[s.key]}y</output>
            </label>
            <input
              type="range"
              id={s.key}
              min={s.min}
              max={s.max}
              value={v[s.key]}
              onChange={(e) => setV({ ...v, [s.key]: +e.target.value })}
            />
            <small>{s.hint}</small>
          </div>
        ))}
      </div>
      <div className="mosca-out">
        <div className={`verdict ${state}`}>
          <span className="v-badge">{state === "risk" ? "AT RISK" : state === "tight" ? "TIGHT" : "ON TRACK"}</span>
          <p>{text}</p>
        </div>
        <div className="timeline">
          <div className="tl-lane">
            <div className="tl-seg mig" style={{ left: 0, width: pct(y) }}>migrate</div>
          </div>
          <div className="tl-lane">
            <div className="tl-seg life" style={{ left: pct(y), width: pct(Math.max(0, Math.min(x, z - y))) }}>data must stay secret</div>
            {end > z && (
              <div className="tl-seg exposed" style={{ left: pct(Math.max(z, y)), width: pct(end - Math.max(z, y)) }}>exposed</div>
            )}
          </div>
          <div className="tl-q" style={{ left: pct(z) }}><span>CRQC ≈ {now + z}</span></div>
          <div className="tl-axis">
            {[0, 10, 20, 30, 40, 50].map((d) => <span key={d}>{now + d}</span>)}
          </div>
        </div>
        <div className="formula">
          x + y {cmp} z &nbsp;→&nbsp; <b>{x} + {y} = {end}</b> {cmp} <b>{z}</b>
        </div>
      </div>
    </div>
  );
}
