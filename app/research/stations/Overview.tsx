"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import * as maplibregl from "maplibre-gl";
type MapLibre = maplibregl.Map;
type Pointer = maplibregl.MapLayerMouseEvent;
import { BASEMAP, ink, prefersDark } from "./basemap";

// [tlc, name, nation, local_authority, longitude, latitude, units_40, unconstrained_ha, constrained_share, entries_exits]
export type Row = [
  string,
  string,
  string,
  string,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
];

// Share of the circle constrained, in four steps of one blue: the data is the only colour, and
// the steps differ in lightness, so they read without colour too.
const STEPS: [number, string, string][] = [
  [0, "#BFE7FB", "under half constrained"],
  [0.5, "#5CC3F4", "half to three quarters"],
  [0.75, "#0EA5F0", "three quarters to 90%"],
  [0.9, "#0A6E9F", "90% or more"],
];

const NATIONS: Record<string, string> = {
  "": "Every nation",
  england: "England",
  wales: "Wales",
  scotland: "Scotland",
  "northern-ireland": "Northern Ireland",
};

const n = (value: number | null) => (value == null ? "–" : Math.round(value).toLocaleString("en-GB"));
const ha = (value: number | null) =>
  value == null ? "–" : `${value.toLocaleString("en-GB", { maximumFractionDigits: 1 })} ha`;
const pc = (value: number | null) => (value == null ? "–" : `${Math.round(value * 100)}%`);

function callout(row: Row) {
  const [tlc, name, , authority, , , units, free, share, use] = row;
  return `<div class="call"><h3>${name}</h3><dl>
    <div><dt>Homes at 40/ha</dt><dd>${n(units)}</dd></div>
    <div><dt>Free land</dt><dd>${ha(free)}</dd></div>
    <div><dt>Constrained</dt><dd>${pc(share)}</dd></div>
    <div><dt>Entries and exits</dt><dd>${n(use)}</dd></div>
  </dl><a href="/research/stations/${tlc.toLowerCase()}">Open ${name} →</a>
  <p class="note" style="margin:6px 0 0">${authority} · ${tlc}</p></div>`;
}

export default function Overview({ rows, children }: { rows: Row[]; children: React.ReactNode }) {
  const holder = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibre | null>(null);
  const [ready, setReady] = useState(false);
  const [hot, setHot] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [nation, setNation] = useState("");
  const [sort, setSort] = useState<{ index: number; descending: boolean }>({ index: 6, descending: true });
  const [all, setAll] = useState(false);
  const byCode = useMemo(() => new Map(rows.map((row) => [row[0], row])), [rows]);

  useEffect(() => {
    if (!holder.current) return;
    const colours = ink();
    const instance = new maplibregl.Map({
      container: holder.current,
      style: prefersDark() ? BASEMAP.dark : BASEMAP.light,
      bounds: [
        [-6.4, 49.9],
        [1.8, 58.7],
      ],
      fitBoundsOptions: { padding: 20 },
      attributionControl: { compact: true },
    });
    map.current = instance;
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    instance.on("load", () => {
      instance.addSource("stations", {
        type: "geojson",
        promoteId: "tlc",
        data: {
          type: "FeatureCollection",
          features: rows
            .filter((row) => row[4] != null && row[5] != null)
            .map((row) => ({
              type: "Feature",
              properties: { tlc: row[0], units: row[6] ?? 0, share: row[8] ?? 1 },
              geometry: { type: "Point", coordinates: [row[4]!, row[5]!] },
            })),
        },
      });
      instance.addLayer({
        id: "stations",
        type: "circle",
        source: "stations",
        layout: { "circle-sort-key": ["get", "units"] },
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            5,
            ["+", 1.5, ["/", ["sqrt", ["get", "units"]], 30]],
            10,
            ["+", 4, ["/", ["sqrt", ["get", "units"]], 8]],
          ],
          "circle-color": [
            "step",
            ["get", "share"],
            STEPS[0][1],
            STEPS[1][0],
            STEPS[1][1],
            STEPS[2][0],
            STEPS[2][1],
            STEPS[3][0],
            STEPS[3][1],
          ],
          "circle-stroke-color": colours.fg,
          "circle-stroke-width": ["case", ["boolean", ["feature-state", "hot"], false], 2.5, 0.5],
        },
      });
      const popup = new maplibregl.Popup({ maxWidth: "320px", offset: 8 });
      instance.on("click", "stations", (event: Pointer) => {
        const code = event.features?.[0]?.properties?.tlc as string | undefined;
        const row = code ? byCode.get(code) : undefined;
        if (!row) return;
        popup.setLngLat([row[4]!, row[5]!]).setHTML(callout(row)).addTo(instance);
      });
      instance.on("mousemove", "stations", (event: Pointer) => {
        instance.getCanvas().style.cursor = "pointer";
        setHot((event.features?.[0]?.properties?.tlc as string) ?? null);
      });
      instance.on("mouseleave", "stations", () => {
        instance.getCanvas().style.cursor = "";
        setHot(null);
      });
      setReady(true);
    });
    return () => instance.remove();
  }, [rows, byCode]);

  // A row lights its station on the map, and a station lights its row.
  const previous = useRef<string | null>(null);
  useEffect(() => {
    const instance = map.current;
    if (!ready || !instance) return;
    if (previous.current) instance.setFeatureState({ source: "stations", id: previous.current }, { hot: false });
    if (hot) instance.setFeatureState({ source: "stations", id: hot }, { hot: true });
    previous.current = hot;
  }, [hot, ready]);

  useEffect(() => {
    const instance = map.current;
    if (!ready || !instance) return;
    instance.setFilter("stations", nation ? ["in", ["get", "tlc"], ["literal", rows.filter((r) => r[2] === nation).map((r) => r[0])]] : null);
  }, [nation, ready, rows]);

  const chosen = useMemo(() => {
    const words = query.trim().toLowerCase();
    const kept = rows.filter(
      (row) =>
        (!nation || row[2] === nation) &&
        (!words || `${row[1]} ${row[3]} ${row[0]}`.toLowerCase().includes(words)),
    );
    return kept.sort((a, b) => {
      const x = a[sort.index];
      const y = b[sort.index];
      if (x == null) return 1;
      if (y == null) return -1;
      const order = typeof x === "number" ? x - (y as number) : String(x).localeCompare(String(y));
      return sort.descending ? -order : order;
    });
  }, [rows, query, nation, sort]);
  const shown = all ? chosen : chosen.slice(0, 100);

  const fly = (row: Row) => {
    if (row[4] == null || row[5] == null || !map.current) return;
    map.current.flyTo({ center: [row[4], row[5]], zoom: 12 });
  };

  const header = (label: string, index: number, numeric = true) => (
    <th className={numeric ? "num" : undefined} aria-sort={sort.index === index ? (sort.descending ? "descending" : "ascending") : "none"}>
      <button
        type="button"
        onClick={() =>
          setSort((now) => ({ index, descending: now.index === index ? !now.descending : numeric }))
        }
      >
        {label}
        {sort.index === index ? (sort.descending ? " ↓" : " ↑") : ""}
      </button>
    </th>
  );

  return (
    <>
      <div className="stage">
        <div ref={holder} className="mapbox" role="region" aria-label="Map of every station" />
        {!ready && <p className="status">Loading the map…</p>}
        <div className="instrument legend" aria-label="Key">
          {STEPS.map(([, colour, label]) => (
            <span className="row" key={label}>
              <i className="round" style={{ background: colour }} aria-hidden="true" />
              {label}
            </span>
          ))}
          <span className="row note" style={{ margin: 0 }}>Larger: more homes on free land</span>
        </div>
      </div>
      <div className="column" id="list">
        {children}
        <section>
          <h2>Find a station</h2>
          <div className="find">
            <input
              type="search"
              aria-label="Find a station"
              placeholder="Name, code or council"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select aria-label="Nation" value={nation} onChange={(event) => setNation(event.target.value)}>
              {Object.entries(NATIONS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <table className="list">
            <thead>
              <tr>
                {header("Station", 1, false)}
                {header("Homes", 6)}
                {header("Free", 7)}
                {header("Constr.", 8)}
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <tr
                  key={row[0]}
                  className={hot === row[0] ? "hot" : undefined}
                  onMouseEnter={() => setHot(row[0])}
                  onMouseLeave={() => setHot(null)}
                >
                  <td>
                    <Link href={`/research/stations/${row[0].toLowerCase()}`} onFocus={() => setHot(row[0])}>
                      {row[1]}
                    </Link>{" "}
                    <button type="button" className="more" style={{ marginTop: 0, fontSize: 10 }} onClick={() => fly(row)} aria-label={`Show ${row[1]} on the map`}>
                      map
                    </button>
                  </td>
                  <td className="num">{n(row[6])}</td>
                  <td className="num">{ha(row[7])}</td>
                  <td className="num">{pc(row[8])}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="note">
            {chosen.length.toLocaleString("en-GB")} stations
            {!all && chosen.length > 100 ? (
              <>
                , the first 100 shown.{" "}
                <button type="button" className="more" onClick={() => setAll(true)}>
                  Show all
                </button>
              </>
            ) : (
              "."
            )}
          </p>
        </section>
      </div>
    </>
  );
}
