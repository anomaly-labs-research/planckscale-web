"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { MODULES } from "@/lib/data";

export default function Platform() {
  const [sel, setSel] = useState(0);
  const [shown, setShown] = useState(0);
  const m = MODULES[sel];
  const lines = m.out.split("\n");

  // Type the console output line by line on each tab change.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(lines.length);
      return;
    }
    setShown(0);
    const id = setInterval(() => setShown((n) => (n >= lines.length ? n : n + 1)), 90);
    return () => clearInterval(id);
  }, [sel, lines.length]);

  const onKey = (e: KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (step == null) return;
    e.preventDefault();
    const next = (sel + step + MODULES.length) % MODULES.length;
    setSel(next);
    document.getElementById(`tab${next}`)?.focus();
  };

  const done = shown >= lines.length;
  const html = lines.slice(0, shown).join("\n") + (done ? " " : "\n") + '<span class="caret"></span>';

  return (
    <div className="platform reveal">
      <div className="tabs" role="tablist" aria-label="Projects" onKeyDown={onKey}>
        {MODULES.map((mod, i) => (
          <button
            key={mod.name}
            className="tab"
            role="tab"
            id={`tab${i}`}
            aria-controls="panel"
            aria-selected={i === sel}
            tabIndex={i === sel ? 0 : -1}
            onClick={() => setSel(i)}
          >
            <span className="t-num">W.0{i + 1} · {mod.status.toUpperCase()}</span>
            <span className="t-name">{mod.name}</span>
            <span className="t-sub">{mod.sub}</span>
          </button>
        ))}
      </div>
      <div className="panel" role="tabpanel" id="panel" aria-labelledby={`tab${sel}`} tabIndex={0}>
        <div className="panel-head">
          <div>
            <h3>{m.name}</h3>
            <p>{m.desc}</p>
          </div>
        </div>
        <div className="chips">
          {m.chips.map((c) => <span key={c} className="chip">{c}</span>)}
        </div>
        <div className="console">
          <div className="console-bar"><i /><i /><i /><span>$ {m.cmd}</span></div>
          <pre dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}
