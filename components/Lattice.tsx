"use client";

import { useEffect, useRef } from "react";

// A rotating 3D integer lattice with one highlighted short basis vector.
export default function Lattice() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pts: [number, number, number][] = [];
    for (let i = -7; i <= 7; i++)
      for (let j = -7; j <= 7; j++)
        for (let k = -3; k <= 3; k++) pts.push([i + 0.35 * j, j * 0.9 + 0.2 * k, k * 1.1 + 0.15 * i]);

    let w = 0, h = 0, mx = 0, my = 0, t = 0, raf = 0;
    const size = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const proj = ([x, y, z]: [number, number, number], a: number, b: number) => {
      let c = Math.cos(a), s = Math.sin(a);
      [x, z] = [x * c - z * s, x * s + z * c];
      c = Math.cos(b); s = Math.sin(b);
      [y, z] = [y * c - z * s, y * s + z * c];
      const f = 9 / (z + 14), sc = Math.min(w, h) * 0.085;
      return [w * 0.62 + x * f * sc, h * 0.42 + y * f * sc, f] as const;
    };

    const frame = () => {
      if (!reduced) t += 0.0016;
      const a = t + mx * 0.6, b = -0.45 + my * 0.3;
      const rgb = getComputedStyle(document.documentElement).getPropertyValue("--rgb-ink").trim();
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        const [x, y, f] = proj(p, a, b);
        const al = Math.max(0, Math.min(1, (f - 0.45) * 1.3));
        ctx.fillStyle = `rgba(${rgb},${al * 0.75})`;
        ctx.beginPath();
        ctx.arc(x, y, f * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      const o = proj([0, 0, 0], a, b), u = proj([1, 0, 0.15], a, b), v = proj([1.35, 0.9, 1.25], a, b);
      ctx.strokeStyle = `rgba(${rgb},.9)`;
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(u[0], u[1]); ctx.stroke();
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(v[0], v[1]); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(${rgb},.6)`;
      ctx.beginPath(); ctx.arc(o[0], o[1], 10 + Math.sin(t * 40) * 2, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = `rgba(${rgb},.55)`;
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillText("SVP(Λ)  b₁ = (1, 0, 0)", u[0] + 10, u[1] - 8);
      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const onResize = () => { size(); if (reduced) frame(); };
    const onMove = (e: PointerEvent) => { mx = e.clientX / w - 0.5; my = e.clientY / h - 0.5; };
    // Repaint on theme flips when the animation loop isn't running.
    const themeObs = new MutationObserver(() => reduced && frame());
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    size();
    frame();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas id="lattice" ref={ref} aria-hidden="true" />;
}
