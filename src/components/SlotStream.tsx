"use client";

import { useEffect, useRef } from "react";

const CELL = 7;
const COLS = 6;
const GAP = 16;
const SLOT_W = COLS * CELL;

// Deterministic noise so a slot keeps the same contents as it scrolls past.
function noise(a: number, b = 0, c = 0) {
  const x = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Slots stream left as columns of transactions; the leader slot boxes its tipped bundle on top. */
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
      const rgb = getComputedStyle(document.documentElement).getPropertyValue("--rgb-ink").trim();
      ctx.clearRect(0, 0, w, h);

      const pitch = SLOT_W + GAP;
      const rows = Math.floor((h * 0.62) / CELL);
      const top = h * 0.14;
      const first = Math.floor(t / pitch);
      const leaderX = w * 0.62;

      for (let i = -1; i <= Math.ceil(w / pitch) + 1; i++) {
        const n = first + i;
        const x = i * pitch - (t % pitch);
        const fade = Math.max(0, Math.min(1, x / w + 0.15));
        const filled = Math.floor(rows * (0.3 + 0.62 * noise(n)));
        const leader = x <= leaderX && leaderX < x + pitch;

        for (let r = rows - filled; r < rows; r++) {
          const bundle = r < rows - filled + 3;
          for (let c = 0; c < COLS; c++) {
            if (noise(n, r, c) < 0.18) continue;
            const a = (bundle ? 0.85 : 0.22 + 0.25 * noise(c, n, r)) * fade;
            ctx.fillStyle = `rgba(${rgb},${a})`;
            ctx.fillRect(x + c * CELL, top + r * CELL, 3, 3);
          }
        }

        if (leader) {
          const y = top + (rows - filled) * CELL;
          ctx.strokeStyle = `rgba(${rgb},.9)`;
          ctx.lineWidth = 1;
          ctx.strokeRect(x - 5.5, y - 5.5, SLOT_W + 8, 3 * CELL + 8);
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.moveTo(x + SLOT_W / 2, y - 6);
          ctx.lineTo(x + SLOT_W / 2, y - 34);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = `rgba(${rgb},.6)`;
          ctx.font = "11px ui-monospace, monospace";
          const tip = (0.0004 + noise(n, 9) * 0.006).toFixed(4);
          ctx.fillText(`SLOT ${(412_000_000 + n).toLocaleString("en")}  ·  BUNDLE TIP ${tip} SOL`, x + SLOT_W / 2 + 8, y - 26);
        }
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
