"use client";

import { useEffect, useState } from "react";

/* Navbar after the DEIXIS site (deixis/components/navbar.tsx): centred mark that shrinks on
   scroll, menu button on the right, full-page blue overlay with large right-aligned items. */

const MENU = [
  { label: "Workflows", href: "#workflows", subs: ["Site appraisal", "Planning", "Development appraisal", "Decisions"] },
  { label: "Workspaces", href: "#workspaces", subs: ["Documents", "Maps", "3D", "Assets"] },
  { label: "Data", href: "#data", subs: ["Planning applications", "Appeals", "London planning data", "Your own record"] },
  { label: "Trust", href: "#trust", subs: ["Who owns the data", "Any AI model", "If Plintoo stops"] },
  { label: "Join the pilot", href: "#join", subs: [] as string[] },
];

export function Mark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" fill="#fff" />
      <path fill="#000" d="M14 14h36v36h-8V22H22v28h-8z" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const tick = () => setTime(new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/London" }));
    tick();
    const id = window.setInterval(tick, 1000);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="bar">
          <div className="status">
            <i />
            Pilot open · <span suppressHydrationWarning>{time}</span> London
          </div>
          <a className="mark" href="#top" aria-label="Plintoo, back to top" onClick={close}>
            <Mark />
            <b>PLINTOO</b>
          </a>
          <button
            className="burger"
            aria-expanded={open}
            aria-controls="overlay"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        id="overlay"
        className={`overlay${open ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <nav aria-label="Main">
          <div className="side">
            The command centre for architects and property developers. Your practice&apos;s own data, memory,
            workflows and model, with any AI plugged in.
          </div>
          <ul>
            {MENU.map((m) => (
              <li key={m.label}>
                <a href={m.href} onClick={close}>
                  {m.label}
                </a>
                {m.subs.length > 0 && (
                  <div className="subs">
                    {m.subs.map((s, i) => (
                      <span key={s}>
                        {i > 0 && " · "}
                        <a href={m.href} onClick={close}>
                          {s}
                        </a>
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
