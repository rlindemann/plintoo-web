"use client";

import { useEffect, useRef } from "react";

/* The dial from the Plintoo sign-in prototype, direction E (plintoo/research/shell/landing.html):
   Plintoo at the centre, wired to what the practice works with. Plain names only on the site. */

const NODES: [string, string, string][] = [
  ["MEMORY", "One memory, every project", "What the practice knows, kept across every chat and project, with where each fact came from."],
  ["DECISIONS", "Who, what, why", "What was decided, by whom and why, captured from chats, minutes and email."],
  ["POLICIES", "Rules and terms", "Every policy and term, exact, so answers rest on the rule itself."],
  ["WORKFLOWS", "Tested on real jobs", "Appraisals, reports and checks that run as one approved plan."],
  ["MODELS", "Claude · GPT · open", "Any model. Switch it, and the memory and the record stay."],
  ["SITES", "London sites", "Allocations, constraints and permissions, each with its source."],
  ["MAPS", "Constraints · access", "Layers named by how they were made, each with its data month."],
  ["3D", "Rhino", "Early massing whose figures feed the value and the planning case."],
  ["DOCUMENTS", "Reports · sheets", "Each paragraph shows what it was built from."],
  ["IMAGES", "Practice library", "The practice library and new renders, every image with its rights."],
  ["TEAM", "Any team · one record", "People change. The reasons stay."],
  ["TOOLS", "Rhino · Revit · your stack", "The tools will keep changing. The practice does not start again."],
];
const LINKS: [number, number][] = [
  [0, 1], [0, 10], [1, 8], [1, 7], [2, 5], [2, 6], [2, 8], [3, 4], [3, 8], [3, 5], [5, 7], [6, 5], [9, 8], [9, 7], [11, 7], [4, 0],
];
const linked = (i: number) => LINKS.filter(([a, b]) => a === i || b === i).map(([a, b]) => (a === i ? b : a));

function build(rm: boolean) {
  const cx = 600, cy = 500, R1 = 250, R2 = 300, RN = 400;
  let g = `<defs><linearGradient id="swl" x1="0" x2="1"><stop offset="0" stop-color="#409CFF" stop-opacity="0"/><stop offset="1" stop-color="#409CFF" stop-opacity=".22"/></linearGradient></defs>`;
  for (let r = 40; r <= 200; r += 40) g += `<circle class="rg" cx="${cx}" cy="${cy}" r="${r}"/>`;
  g += `<circle class="rg" cx="${cx}" cy="${cy}" r="${R1}" stroke="#2A3038"/><circle class="rg" cx="${cx}" cy="${cy}" r="${R2}" stroke="#2A3038"/>`;
  for (let i = 0; i < 180; i++) {
    const a = (i / 180) * Math.PI * 2, m = i % 15 === 0, r1 = R2 + (m ? 16 : 7);
    g += `<line class="tk ${m ? "m" : ""}" x1="${cx + R2 * Math.cos(a)}" y1="${cy + R2 * Math.sin(a)}" x2="${cx + r1 * Math.cos(a)}" y2="${cy + r1 * Math.sin(a)}"/>`;
  }
  const arc = (a0: number, a1: number, r: number, cls: string) => {
    const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `<path class="arc ${cls}" d="M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}"/>`;
  };
  ([[-1.4, -0.4, ""], [-0.25, 0.75, "on"], [0.95, 2.0, ""], [2.2, 3.1, "on"], [3.3, 4.4, ""]] as [number, number, string][]).forEach(
    ([a, b, c]) => (g += arc(a, b, R1 + 22, c)),
  );
  g += `<path class="sweep" style="--cx:${cx}px;--cy:${cy}px" d="M${cx} ${cy}L${cx + R1} ${cy}A${R1} ${R1} 0 0 1 ${cx + R1 * Math.cos(0.5)} ${cy + R1 * Math.sin(0.5)}Z" fill="url(#swl)"/>`;
  const POS = NODES.map((_, i) => {
    const a = -Math.PI / 2 + (i / NODES.length) * Math.PI * 2;
    return [cx + RN * Math.cos(a), cy + RN * Math.sin(a) * 0.9];
  });
  const curve = ([x0, y0]: number[], [x1, y1]: number[]) => {
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, kx = mx + (cx - mx) * 0.55, ky = my + (cy - my) * 0.55;
    return `M${x0.toFixed(1)} ${y0.toFixed(1)}Q${kx.toFixed(1)} ${ky.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  LINKS.forEach(([p, q]) => (g += `<path class="lk" data-a="${p}" data-b="${q}" d="${curve(POS[p], POS[q])}"/>`));
  if (!rm) {
    POS.forEach(([x, y], i) => {
      const d = i % 2 === 0 ? `M${x} ${y}L${cx} ${cy}` : `M${cx} ${cy}L${x} ${y}`;
      g += `<circle class="pd" r="2.6"><animateMotion dur="${(2.6 + (i % 4) * 0.5).toFixed(1)}s" begin="${(1.8 + i * 0.37).toFixed(2)}s" repeatCount="indefinite" path="${d}"/></circle>`;
    });
    LINKS.forEach(([p, q], n) => {
      g += `<circle class="pd" r="2" opacity=".8"><animateMotion dur="${(4 + (n % 3)).toFixed(1)}s" begin="${(3 + n * 0.6).toFixed(1)}s" repeatCount="indefinite" path="${curve(POS[p], POS[q])}"/></circle>`;
    });
  }
  NODES.forEach(([t, s], i) => {
    const a = -Math.PI / 2 + (i / NODES.length) * Math.PI * 2, [nx, ny] = POS[i], len = Math.hypot(nx - cx, ny - cy);
    g += `<line class="sp" id="sp${i}" style="--l:${len.toFixed(0)};animation-delay:${0.3 + i * 0.12}s" x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}"/>`;
    const right = Math.cos(a) > 0.2, left = Math.cos(a) < -0.2;
    const tx = right ? nx + 30 : left ? nx - 30 : nx, anc = right ? "start" : left ? "end" : "middle";
    const ty = Math.abs(Math.cos(a)) <= 0.2 ? (Math.sin(a) < 0 ? ny - 40 : ny + 40) : ny - 2;
    g += `<g class="node" data-i="${i}" style="animation-delay:${0.7 + i * 0.12}s" tabindex="0" role="button" aria-label="${t}: ${s}"><rect class="w" x="${nx - 18}" y="${ny - 13}" width="36" height="26"/><rect class="bar" x="${nx - 18}" y="${ny - 13}" width="36" height="5"/><text x="${tx}" y="${ty}" text-anchor="${anc}">${t}</text><text class="s" x="${tx}" y="${ty + 17}" text-anchor="${anc}">${s}</text></g>`;
  });
  g += `<circle class="pulse" id="pl" r="4" cx="${cx}" cy="${cy}" opacity="0"/><circle cx="${cx}" cy="${cy}" r="22" fill="none" stroke="#409CFF" opacity=".5"/><circle class="hub" cx="${cx}" cy="${cy}" r="8"/>`;
  return g;
}

export default function Dial() {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const capt = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = wrap.current!, s = svg.current!;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    s.innerHTML = build(rm);

    const say = (i: number) => {
      const rel = linked(i);
      root.querySelectorAll<SVGGElement>(".node").forEach((n) => {
        const j = +n.dataset.i!;
        n.classList.toggle("hot", j === i);
        n.classList.toggle("rel", rel.includes(j));
      });
      root.querySelectorAll<SVGLineElement>(".sp").forEach((l) => {
        const j = +l.id.slice(2);
        l.classList.toggle("hot", j === i || rel.includes(j));
        l.classList.toggle("dim", j !== i && !rel.includes(j));
      });
      root.querySelectorAll<SVGPathElement>(".lk").forEach((l) => {
        const on = +l.dataset.a! === i || +l.dataset.b! === i;
        l.classList.toggle("hot", on);
        l.classList.toggle("dim", !on);
      });
      capt.current!.innerHTML = `<b>${NODES[i][0]}</b> · ${NODES[i][2]}<br><span style="color:#409CFF">Connects to ${rel
        .map((j) => NODES[j][0].toLowerCase())
        .join(", ")}</span>`;
    };

    let auto = true, k = 0, timer = 0, delay = 0;
    root.querySelectorAll<SVGGElement>(".node").forEach((n) => {
      const h = () => {
        auto = false;
        say(+n.dataset.i!);
      };
      n.addEventListener("mouseenter", h);
      n.addEventListener("focus", h);
    });

    const start = () => {
      if (rm) return say(0);
      const pl = s.querySelector<SVGCircleElement>("#pl")!;
      const flow = () => {
        const l = s.querySelector<SVGLineElement>("#sp" + k)!;
        const x1 = +l.getAttribute("x2")!, y1 = +l.getAttribute("y2")!, x0 = +l.getAttribute("x1")!, y0 = +l.getAttribute("y1")!;
        const t0 = performance.now();
        if (auto) say(k);
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / 900);
          pl.setAttribute("cx", String(x1 + (x0 - x1) * p));
          pl.setAttribute("cy", String(y1 + (y0 - y1) * p));
          pl.setAttribute("opacity", p < 1 ? "1" : "0");
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        k = (k + 5) % NODES.length;
      };
      delay = window.setTimeout(() => {
        flow();
        timer = window.setInterval(flow, 2400);
      }, 1800);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          root.classList.add("in");
          start();
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      window.clearTimeout(delay);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="dial rv" ref={wrap}>
      <svg
        ref={svg}
        viewBox="40 70 1120 860"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Plintoo at the centre, connected to memory, decisions, policies, workflows, models, sites, maps, 3D, documents, images, team and tools"
      />
      <div className="capt" ref={capt}>
        Hover a spoke
      </div>
    </div>
  );
}
