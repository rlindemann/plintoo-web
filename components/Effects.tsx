"use client";

import { useEffect } from "react";

/* Page-wide motion: reveal on scroll, counters, hero parallax, film plays when on screen.
   Everything is skipped when the visitor asks for reduced motion. */

function count(el: HTMLElement, to: number, ms = 1600, rm = false) {
  const fmt = (v: number) => Math.round(v).toLocaleString("en-GB");
  if (rm) {
    el.textContent = fmt(to);
    return;
  }
  const t0 = performance.now();
  const f = (t: number) => {
    const p = Math.min(1, (t - t0) / ms);
    el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

export default function Effects() {
  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Hero counters
    const heroTimers = Array.from(document.querySelectorAll<HTMLElement>(".hero [data-to]")).map((e, i) =>
      window.setTimeout(() => count(e, +e.dataset.to!, 1600, rm), 900 + i * 200),
    );

    // Reveal on scroll, with counters inside revealed blocks
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target as HTMLElement;
          el.classList.add("in");
          io.unobserve(el);
          el.querySelectorAll<HTMLElement>("[data-to]").forEach((d) => count(d, +d.dataset.to!, 1600, rm));
          if (el.id === "dim95") count(document.getElementById("pct")!, 95, 1400, rm);
        }),
      { threshold: 0.2 },
    );
    document.querySelectorAll(".rv:not(.dial)").forEach((el) => io.observe(el));

    // Hero parallax
    const stage = document.getElementById("stage");
    const onScroll = () => {
      if (stage && window.scrollY < window.innerHeight * 1.2) stage.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    };
    if (!rm) window.addEventListener("scroll", onScroll, { passive: true });

    // Film plays when it is on screen
    const fv = document.getElementById("filmv") as HTMLVideoElement | null;
    const vio = new IntersectionObserver(
      ([e]) => {
        if (!fv || rm) return;
        if (e.isIntersecting) fv.play().catch(() => {});
        else fv.pause();
      },
      { threshold: 0.5 },
    );
    if (fv) vio.observe(fv);

    return () => {
      heroTimers.forEach((t) => window.clearTimeout(t));
      io.disconnect();
      vio.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
