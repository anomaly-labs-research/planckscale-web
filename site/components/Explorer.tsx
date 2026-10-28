"use client";

import { useState } from "react";
import { ALGO_GROUPS, type QStatus } from "@/site/lib/data";

const LABEL: Record<QStatus, string> = { broken: "Broken", weak: "Weakened", safe: "Resistant" };
const ALL = ALGO_GROUPS.flatMap((g) => g.algos);
const RSA = ALL.find((a) => a.id === "rsa")!;
const MAX = Math.sqrt(7856);

export default function Explorer() {
  const [id, setId] = useState("mldsa");
  const a = ALL.find((x) => x.id === id)!;
  const bars = [
    ...RSA.sizes.map(([l, v]) => ({ label: `RSA ${l}`, v, ref: true })),
    ...a.sizes.map(([l, v]) => ({ label: `${a.short} ${l}`, v, ref: false })),
  ];

  return (
    <div className="explorer reveal">
      <div className="table-scroll">
        <table className="algo-table">
          <thead>
            <tr><th>Algorithm</th><th>Role</th><th>Classical</th><th>Quantum</th></tr>
          </thead>
          <tbody>
            {ALGO_GROUPS.map((g) => [
              <tr key={g.group} className="group"><td colSpan={4}>{g.group}</td></tr>,
              ...g.algos.map((x) => (
                <tr
                  key={x.id}
                  tabIndex={0}
                  aria-selected={x.id === id}
                  onClick={() => setId(x.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setId(x.id); }
                  }}
                >
                  <td>{x.name}</td>
                  <td>{x.role}</td>
                  <td>{x.cl}</td>
                  <td><span className={`pill ${x.q}`}>{LABEL[x.q]}</span></td>
                </tr>
              )),
            ])}
          </tbody>
        </table>
      </div>
      <div className="detail" aria-live="polite">
        <div>
          <div className="std">{a.std}</div>
          <h3>{a.name}</h3>
        </div>
        <p>{a.desc}</p>
        <div className="kv">
          <div><span>Classical security</span><strong>{a.cl}</strong></div>
          <div><span>Post-quantum</span><strong>{a.pq}</strong></div>
        </div>
        <div>
          <div className="eyebrow">Wire size vs RSA-2048 (bytes)</div>
          <div className="bars">
            {bars.map((b) => (
              <div key={b.label} className="bar-row">
                <span>{b.label}</span>
                <div className="bar-track">
                  <div className={`bar-fill${b.ref ? " ref" : ""}`} style={{ width: `${(Math.sqrt(b.v) / MAX) * 100}%` }} />
                </div>
                <b>{b.v.toLocaleString("en-US")}</b>
              </div>
            ))}
          </div>
        </div>
        <p className="note">Bar length on a square-root scale. Sizes per FIPS 203/204/205 and draft FIPS 206 parameter sets.</p>
      </div>
    </div>
  );
}
