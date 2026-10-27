"use client";

import { MODES } from "@/lib/modes";
import { setMode } from "@/lib/mode-client";

const NUMERALS = ["I", "II", "III"];

/** Home-page cards explaining the three reading levels; the active one is lit by CSS. */
export function ModePicker() {
  return (
    <div className="grid-cards cols-3">
      {MODES.map((m, i) => (
        <button
          key={m.id}
          type="button"
          data-value={m.id}
          onClick={() => setMode(m.id)}
          className="mode-card card reveal"
        >
          <span className="flex items-center justify-between">
            <span className="num">{NUMERALS[i]} / LEVEL</span>
            <span className="mode-card-check">Selected</span>
          </span>
          <span className="label">{m.label}</span>
          <span className="aud">{m.audience}</span>
          <span className="desc">{m.description}</span>
        </button>
      ))}
    </div>
  );
}
