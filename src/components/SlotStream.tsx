"use client";

import { useEffect, useRef } from "react";

const CELL = 7;
const COLS = 6;
const GAP = 16;
const SLOT_W = COLS * CELL;
const LABEL_H = 11;

// Each strategy draws its bundle txs with its own glyph so the stream stays monochrome.
const KINDS = [
  { id: "ARB", w: 0.32, glyph: 0 },
  { id: "LIQ", w: 0.14, glyph: 1 },
  { id: "FUND", w: 0.1, glyph: 2 },
  { id: "JIT", w: 0.12, glyph: 3 },
  { id: "SNIPE", w: 0.18, glyph: 1 },
  { id: "MM", w: 0.14, glyph: 2 },
];

type Bundle = { kind: (typeof KINDS)[number]; rows: number; txs: number; tip: number };

// Deterministic noise so a slot keeps the same contents as it scrolls past.
function noise(a: number, b = 0, c = 0) {
  const x = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return x - Math.floor(x);
}

function pick(u: number) {
  for (const k of KINDS) if ((u -= k.w) < 0) return k;
  return KINDS[0];
}

// 1–3 bundles per slot, ordered top-down by tip like the block engine would.
function bundlesFor(n: number): Bundle[] {
  const count = 1 + Math.floor(noise(n, 7) * 3);
  return Array.from({ length: count }, (_, b) => ({
    kind: pick(noise(n, b, 1)),
    rows: 2 + Math.floor(noise(n, b, 2) * 2),
    txs: 2 + Math.floor(noise(n, b, 3) * 4),
    tip: 0.0004 + noise(n, b, 4) * 0.006,
  })).sort((a, b) => b.tip - a.tip);
}

function glyph(ctx: CanvasRenderingContext2D, g: number, x: number, y: number) {
  if (g === 0) ctx.fillRect(x, y, 4, 4);
  else if (g === 1) { ctx.fillRect(x + 2, y, 1, 5); ctx.fillRect(x, y + 2, 5, 1); }
  else if (g === 2) { ctx.fillRect(x, y, 5, 1); ctx.fillRect(x, y + 3, 5, 1); }
  else { ctx.fillRect(x, y, 1, 5); ctx.fillRect(x + 3, y, 1, 5); }
}

/** Slots stream left as columns of transactions topped by labeled strategy bundles; the leader slot gets a breakdown. */
export function SlotStream() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, t = 0, raf = 0;

    const size = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = () => {
      if (!reduced) t += 0.35;
      const css = getComputedStyle(document.documentElement);
      const rgb = css.getPropertyValue("--rgb-ink").trim();
      const bg = css.getPropertyValue("--bg").trim();
      ctx.clearRect(0, 0, w, h);
      ctx.textBaseline = "top";

      const pitch = SLOT_W + GAP;
      const rows = Math.floor((h * 0.5) / CELL);
      const bottom = h * 0.8;
      const first = Math.floor(t / pitch);
      const leaderX = w * 0.62;
      let callout: { x: number; y: number; n: number; bundles: Bundle[] } | null = null;

      for (let i = -1; i <= Math.ceil(w / pitch) + 1; i++) {
        const n = first + i;
        const x = i * pitch - (t % pitch);
        const fade = Math.max(0, Math.min(1, x / w + 0.15));
        // Slots entering on the right are still being built: txs pile up, then bundles land.
        const built = reduced ? 1 : Math.max(0, Math.min(1, (w - x) / (pitch * 2.5)));
        const filled = Math.floor(rows * (0.25 + 0.5 * noise(n)) * built);

        for (let r = 0; r < filled; r++) {
          for (let c = 0; c < COLS; c++) {
            if (noise(n, r, c) < 0.18) continue;
            ctx.fillStyle = `rgba(${rgb},${(0.16 + 0.22 * noise(c, n, r)) * fade})`;
            ctx.fillRect(x + c * CELL, bottom - (r + 1) * CELL, 3, 3);
          }
        }

        const land = Math.max(0, Math.min(1, (built - 0.75) / 0.25));
        if (land === 0) continue;
        const bundles = bundlesFor(n);
        const stackH = bundles.reduce((s, b) => s + LABEL_H + b.rows * CELL, 0);
        const stackTop = bottom - filled * CELL - stackH - 4;
        const drop = (1 - land) * 18;
        let y = stackTop - drop;

        for (const [bi, b] of bundles.entries()) {
          const a = fade * land;
          ctx.fillStyle = `rgba(${rgb},${0.55 * a})`;
          ctx.font = "8px ui-monospace, monospace";
          ctx.fillText(b.kind.id, x, y + 1);
          ctx.fillRect(x - 4, y + 1, 1, LABEL_H + b.rows * CELL - 4);
          y += LABEL_H;
          for (let r = 0; r < b.rows; r++) {
            for (let c = 0; c < COLS; c++) {
              // Bundles with more txs render denser.
              if (noise(n, bi * 10 + r, c + 20) > b.txs / 5) continue;
              ctx.fillStyle = `rgba(${rgb},${(0.6 + 0.35 * noise(c, r, n)) * a})`;
              glyph(ctx, b.kind.glyph, x + c * CELL, y + r * CELL);
            }
          }
          y += b.rows * CELL;
        }

        if (land === 1 && x <= leaderX && leaderX < x + pitch) callout = { x, y: stackTop, n, bundles };
      }

      if (callout) {
        const { x, y, n, bundles } = callout;
        const stackH = bundles.reduce((s, b) => s + LABEL_H + b.rows * CELL, 0);
        ctx.strokeStyle = `rgba(${rgb},.9)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 8.5, y - 5.5, SLOT_W + 12, stackH + 8);

        const lines = [
          `SLOT ${(412_000_000 + n).toLocaleString("en")}  ·  LEADER`,
          ...bundles.map((b) => `${b.kind.id.padEnd(6)}${b.txs} tx   tip ${b.tip.toFixed(4)} SOL`),
        ];
        ctx.font = "11px ui-monospace, monospace";
        const boxW = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 20;
        const boxH = lines.length * 16 + 12;
        const right = x + SLOT_W + 22;
        const bx = right + boxW < w - 8 ? right : x - boxW - 22;
        const by = Math.max(8, y - boxH - 24);

        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(x + SLOT_W / 2, y - 6);
        ctx.lineTo(x + SLOT_W / 2, by + boxH / 2);
        ctx.lineTo(bx > x ? bx : bx + boxW, by + boxH / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = bg;
        ctx.fillRect(bx, by, boxW, boxH);
        ctx.strokeStyle = `rgba(${rgb},.35)`;
        ctx.strokeRect(bx + 0.5, by + 0.5, boxW - 1, boxH - 1);
        lines.forEach((l, i) => {
          ctx.fillStyle = `rgba(${rgb},${i === 0 ? 0.85 : 0.6})`;
          ctx.fillText(l, bx + 10, by + 9 + i * 16);
        });
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const onResize = () => { size(); if (reduced) frame(); };
    // Repaint on theme flips when the animation loop isn't running.
    const themeObs = new MutationObserver(() => reduced && frame());
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    size();
    frame();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
