"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
type MapLibre = maplibregl.Map;
type Pointer = maplibregl.MapLayerMouseEvent;
import { CONSTRAINT_KINDS, FLAG_KINDS } from "@/lib/station-kinds";
import { BASEMAP, ink, prefersDark } from "../basemap";

// [kind, area_ha, share, mapped, in_union, features], as constraints.json holds them
type ConstraintRow = [string, number | null, number | null, boolean | null, boolean | null, number | null];

const FREE = "#0EA5F0";
const ha = (value: number | null | undefined) =>
  value == null ? "–" : `${value.toLocaleString("en-GB", { maximumFractionDigits: 1 })} ha`;
const pc = (value: number | null | undefined) => (value == null ? "–" : `${Math.round(value * 100)}%`);

export default function StationPlate({
  tlc,
  centre,
  rows,
  parcels,
  head,
  children,
}: {
  tlc: string;
  centre: [number, number] | null;
  rows: ConstraintRow[];
  parcels: { count: number | null; ha: number | null; units: number | null };
  head: React.ReactNode;
  children: React.ReactNode;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibre | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  const byKind = useMemo(() => new Map(rows.map((row) => [row[0], row])), [rows]);
  // The kinds the station has, in the study's order, flood zone 2 being neither constraint nor flag.
  const kinds = useMemo(
    () => CONSTRAINT_KINDS.filter(([kind]) => kind !== "flood-zone-2" && byKind.has(kind)),
    [byKind],
  );
  const [shown, setShown] = useState<Set<string>>(
    () => new Set([...kinds.map(([kind]) => kind), "unconstrained", "parcel"]),
  );
  const [hot, setHot] = useState<string | null>(null);

  useEffect(() => {
    if (!holder.current) return;
    const colours = ink();
    const instance = new maplibregl.Map({
      container: holder.current,
      style: prefersDark() ? BASEMAP.dark : BASEMAP.light,
      center: centre ?? [-1.5, 53],
      zoom: centre ? 13.4 : 5,
      attributionControl: { compact: true },
    });
    map.current = instance;
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    instance.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");
    instance.on("load", async () => {
      const response = await fetch(`/station-shapes/station-${tlc}.json`);
      if (!response.ok) {
        setState("missing");
        return;
      }
      const shapes = await response.json();
      instance.addSource("shapes", { type: "geojson", data: shapes });
      // Fit the map to the 1 km circle.
      const circle = shapes.features.find(
        (f: { properties: { layer: string } }) => f.properties.layer === "study-area",
      );
      if (circle) {
        const ring: [number, number][] = (circle.geometry.type === "Polygon"
          ? circle.geometry.coordinates[0]
          : circle.geometry.coordinates.flat(1)[0]) as [number, number][];
        const xs = ring.map((p) => p[0]);
        const ys = ring.map((p) => p[1]);
        instance.fitBounds(
          [
            [Math.min(...xs), Math.min(...ys)],
            [Math.max(...xs), Math.max(...ys)],
          ],
          { padding: 32, duration: 0 },
        );
      }
      const constraint = ["all", ["!=", ["get", "layer"], "study-area"], ["!=", ["get", "layer"], "unconstrained"], ["!=", ["get", "layer"], "parcel"]];
      instance.addLayer({
        id: "constraints",
        type: "fill",
        source: "shapes",
        filter: ["all", constraint, ["!", ["in", ["get", "layer"], ["literal", FLAG_KINDS]]]] as never,
        paint: { "fill-color": colours.fg, "fill-opacity": 0.13 },
      });
      instance.addLayer({
        id: "constraint-edges",
        type: "line",
        source: "shapes",
        filter: ["all", constraint, ["!", ["in", ["get", "layer"], ["literal", FLAG_KINDS]]]] as never,
        paint: { "line-color": colours.fg, "line-opacity": 0.35, "line-width": 0.5 },
      });
      instance.addLayer({
        id: "flags",
        type: "line",
        source: "shapes",
        filter: ["in", ["get", "layer"], ["literal", FLAG_KINDS]] as never,
        paint: { "line-color": colours.fg, "line-width": 1.2, "line-dasharray": [2, 2] },
      });
      instance.addLayer({
        id: "free",
        type: "fill",
        source: "shapes",
        filter: ["==", ["get", "layer"], "unconstrained"],
        paint: { "fill-color": FREE, "fill-opacity": 0.5 },
      });
      instance.addLayer({
        id: "parcels",
        type: "line",
        source: "shapes",
        filter: ["==", ["get", "layer"], "parcel"],
        paint: { "line-color": colours.fg, "line-width": 1.2 },
      });
      instance.addLayer({
        id: "hot",
        type: "fill",
        source: "shapes",
        filter: ["==", ["get", "layer"], ""],
        paint: { "fill-color": colours.fg, "fill-opacity": 0.5 },
      });
      instance.addLayer({
        id: "circle",
        type: "line",
        source: "shapes",
        filter: ["==", ["get", "layer"], "study-area"],
        paint: { "line-color": colours.fg, "line-width": 2 },
      });
      const popup = new maplibregl.Popup({ maxWidth: "280px", offset: 6 });
      instance.on("click", "parcels", (event: Pointer) => {
        const p = event.features?.[0]?.properties;
        if (!p) return;
        popup
          .setLngLat(event.lngLat)
          .setHTML(
            `<div class="call"><h3>Parcel ${p.id}</h3><dl><div><dt>Free land</dt><dd>${ha(p.area_ha)}</dd></div><div><dt>Homes at 40/ha</dt><dd>${Number(p.units_40 ?? 0).toLocaleString("en-GB")}</dd></div></dl></div>`,
          )
          .addTo(instance);
      });
      instance.on("mouseenter", "parcels", () => (instance.getCanvas().style.cursor = "pointer"));
      instance.on("mouseleave", "parcels", () => (instance.getCanvas().style.cursor = ""));
      setState("ready");
    });
    return () => instance.remove();
  }, [tlc, centre]);

  // Ticking a row shows or hides its layer; pointing at a row darkens its outline on the map.
  useEffect(() => {
    const instance = map.current;
    if (state !== "ready" || !instance) return;
    const visible = ["literal", [...shown]];
    instance.setFilter("constraints", ["all", ["in", ["get", "layer"], visible], ["!", ["in", ["get", "layer"], ["literal", FLAG_KINDS]]]] as never);
    instance.setFilter("constraint-edges", ["all", ["in", ["get", "layer"], visible], ["!", ["in", ["get", "layer"], ["literal", FLAG_KINDS]]]] as never);
    instance.setFilter("flags", ["all", ["in", ["get", "layer"], visible], ["in", ["get", "layer"], ["literal", FLAG_KINDS]]] as never);
    instance.setLayoutProperty("free", "visibility", shown.has("unconstrained") ? "visible" : "none");
    instance.setLayoutProperty("parcels", "visibility", shown.has("parcel") ? "visible" : "none");
    instance.setFilter("hot", ["==", ["get", "layer"], hot && hot !== "unconstrained" && hot !== "parcel" ? hot : ""]);
  }, [shown, hot, state]);

  const toggle = (kind: string) =>
    setShown((now) => {
      const next = new Set(now);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });

  const row = (kind: string, label: React.ReactNode, swatch: React.CSSProperties, value: string, extra?: string) => (
    <label
      key={kind}
      className={`${shown.has(kind) ? "" : "off"} ${hot === kind ? "hot" : ""}`}
      onMouseEnter={() => setHot(kind)}
      onMouseLeave={() => setHot(null)}
    >
      <input type="checkbox" checked={shown.has(kind)} onChange={() => toggle(kind)} onFocus={() => setHot(kind)} onBlur={() => setHot(null)} />
      <i style={swatch} aria-hidden="true" />
      <span>
        {label}
        {extra && <em>{extra}</em>}
      </span>
      <span className="value">{value}</span>
    </label>
  );

  return (
    <>
      <div className="stage">
        <div ref={holder} className="mapbox" role="region" aria-label="Map of the land within 1 km of the station" />
        {state === "loading" && <p className="status">Loading the map…</p>}
        {state === "missing" && <p className="status">This station's map is not available.</p>}
      </div>
      <div className="column">
        {head}
        <section>
          <h2>On the map · share of the 1 km circle</h2>
          <div className="layers">
            {row(
              "unconstrained",
              "Free land",
              { background: FREE, opacity: 0.8 },
              `${pc(byKind.get("unconstrained")?.[2])} · ${ha(byKind.get("unconstrained")?.[1])}`,
            )}
            {row(
              "parcel",
              "Parcels that count",
              { background: "transparent" },
              `${(parcels.count ?? 0).toLocaleString("en-GB")} · ${(parcels.units ?? 0).toLocaleString("en-GB")} homes`,
            )}
            {kinds.map(([kind, label]) => {
              const [, area, share, mapped] = byKind.get(kind)!;
              const flag = FLAG_KINDS.includes(kind);
              return row(
                kind,
                label,
                flag
                  ? { background: "transparent", borderStyle: "dashed" }
                  : { background: "currentColor", opacity: 0.25 },
                mapped === false ? "not mapped" : `${pc(share)} · ${ha(area)}`,
                flag ? "flag" : undefined,
              );
            })}
          </div>
          <p className="note">
            Constraints are grey and overlap; together they cover {pc(byKind.get("all-constraints")?.[2])}. Flags,
            dashed, are shown but not taken out of the free land.
          </p>
        </section>
        {children}
      </div>
    </>
  );
}
