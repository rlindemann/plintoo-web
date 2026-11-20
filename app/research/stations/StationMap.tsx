"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// [tlc, name, x, y, units_40, constrained_share, nation]
export type Dot = [string, string, number, number, number, number, string];

const BANDS = [
  { upTo: 0.5, label: "under half constrained", fill: "#D2E8FF" },
  { upTo: 0.75, label: "half to three quarters", fill: "#8EC2FF" },
  { upTo: 0.9, label: "three quarters to 90%", fill: "#4C93E6" },
  { upTo: 1.01, label: "90% or more", fill: "#2B5E9E" },
];

const band = (share: number) => BANDS.find((b) => share < b.upTo) ?? BANDS[BANDS.length - 1];
const radius = (units: number) => 1.2 + Math.sqrt(units) / 18;

export default function StationMap({
  dots,
  width,
  height,
}: {
  dots: Dot[];
  width: number;
  height: number;
}) {
  const [active, setActive] = useState<Dot | null>(null);
  // Largest last, so the small stations stay visible under them.
  const ordered = useMemo(() => [...dots].sort((a, b) => a[4] - b[4]), [dots]);

  return (
    <figure className="map">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Map of ${dots.length.toLocaleString("en-GB")} stations in Great Britain, each sized by the homes its free land could hold and shaded by how much of its 1 km circle is constrained.`}
      >
        {ordered.map((dot) => {
          const [tlc, name, x, y, units, share] = dot;
          return (
            <Link
              key={tlc}
              href={`/research/stations/${tlc.toLowerCase()}`}
              onMouseEnter={() => setActive(dot)}
              onFocus={() => setActive(dot)}
              aria-label={`${name}: ${units.toLocaleString("en-GB")} homes at 40 a hectare, ${Math.round(share * 100)}% constrained`}
            >
              <circle
                cx={x}
                cy={y}
                r={radius(units)}
                fill={band(share).fill}
                stroke={active?.[0] === tlc ? "#F4F6F8" : "#080A0C"}
                strokeWidth={active?.[0] === tlc ? 1.2 : 0.3}
              />
            </Link>
          );
        })}
      </svg>
      <figcaption>
        <p className="readout" aria-live="polite">
          {active ? (
            <>
              <b>{active[1]}</b> · {active[4].toLocaleString("en-GB")} homes at 40 a hectare ·{" "}
              {Math.round(active[5] * 100)}% of the circle constrained
            </>
          ) : (
            "Point at a station to read it; select it to open its page."
          )}
        </p>
        <ul className="legend" aria-label="Share of the 1 km circle constrained">
          {BANDS.map((b) => (
            <li key={b.label}>
              <i style={{ background: b.fill }} aria-hidden="true" />
              {b.label}
            </li>
          ))}
          <li className="size">Larger dot: more homes on its free land</li>
        </ul>
      </figcaption>
    </figure>
  );
}
