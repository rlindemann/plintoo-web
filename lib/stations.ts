// The station study's files, written by plintoo-data (`plintoo-data export station-study`) and
// kept in data/station-study/. Read at build time only: the pages are static, and nothing here
// is computed beyond counting and summing what the files hold.
import { readFileSync } from "node:fs";
import path from "node:path";

export type Station = {
  tlc: string;
  station: string;
  local_authority: string | null;
  nation: "england" | "wales" | "scotland" | "northern-ireland";
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  usage_period: string | null;
  entries_exits: number | null;
  trains_per_hour_min_daytime: number | null;
  well_connected: boolean | null;
  study_area_ha: number | null;
  constrained_ha: number | null;
  constrained_share: number | null;
  unconstrained_ha: number | null;
  parcels: number | null;
  parcel_ha: number | null;
  units_40: number | null;
  units_50: number | null;
  flood_zone_3_ha: number | null;
  habitat_ha: number | null;
  existing_development_ha: number | null;
  in_green_belt: boolean | null;
  green_belt_share: number | null;
  in_national_landscape: boolean | null;
  national_landscape_share: number | null;
  steep_share: number | null;
};

// [kind, area_ha, share, mapped, in_union, features]
export type ConstraintRow = [string, number | null, number | null, boolean | null, boolean | null, number | null];
// [kind, era, period, features, homes, area_ha, share]
export type HistoryRow = [string, string | null, string | null, number | null, number | null, number | null, number | null];

export type Product = {
  dataset: string;
  title: string;
  version: string;
  created_at: string;
  rows: number;
  from: Record<string, string>;
};

export type Sources = { exported_at: string; products: Product[] };

// A station's photographs, from Bildhaus (shown as Assets). Empty until an album is shared.
export type Asset = { src: string; alt: string; credit: string };

const folder = path.join(process.cwd(), "data", "station-study");

function read<T>(name: string, fallback?: T): T {
  const file = path.join(folder, name);
  try {
    return JSON.parse(readFileSync(file, "utf-8")) as T;
  } catch (error) {
    if (fallback !== undefined) return fallback;
    throw error;
  }
}

let cache: {
  stations: Station[];
  constraints: Record<string, ConstraintRow[]>;
  history: Record<string, HistoryRow[]>;
  sources: Sources;
  assets: Record<string, Asset[]>;
} | null = null;

export function study() {
  cache ??= {
    stations: read<Station[]>("stations.json"),
    constraints: read<Record<string, ConstraintRow[]>>("constraints.json"),
    history: read<Record<string, HistoryRow[]>>("history.json"),
    sources: read<Sources>("sources.json"),
    assets: read<Record<string, Asset[]>>("assets.json", {}),
  };
  return cache;
}

export const NATIONS: Record<Station["nation"], string> = {
  england: "England",
  wales: "Wales",
  scotland: "Scotland",
  "northern-ireland": "Northern Ireland",
};

// Plain names for the constraint kinds, in the order the study lists them.
export const CONSTRAINT_KINDS: [string, string][] = [
  ["flood-zone-3", "Flood zone 3"],
  ["flood-zone-2", "Flood zone 2"],
  ["sssi", "Sites of Special Scientific Interest"],
  ["scheduled-monument", "Scheduled monuments"],
  ["park-and-garden", "Registered parks and gardens"],
  ["battlefield", "Registered battlefields"],
  ["listed-building", "Listed buildings"],
  ["ancient-woodland-buffer", "Ancient woodland and 30 m around it"],
  ["habitat-wet", "Priority habitats, wet"],
  ["habitat-dry", "Priority habitats, dry"],
  ["watercourse-buffer", "Rivers and 10 m either side"],
  ["existing-development", "Buildings and 10 m around them"],
  ["road-noise", "Road noise over 50 dB"],
  ["rail-noise", "Rail noise over 50 dB"],
  ["green-belt", "Green Belt"],
  ["national-landscape", "National Landscape"],
  ["steep-slope", "Slopes steeper than 1 in 10"],
];

export const HISTORY_KINDS: Record<string, string> = {
  "conservation-area": "Conservation areas",
  "listed-building": "Listed buildings",
  "scheduled-monument": "Scheduled monuments",
  "park-and-garden": "Registered parks and gardens",
  battlefield: "Registered battlefields",
  "world-heritage-site": "World Heritage Sites",
  "woodland-ancient": "Ancient woodland",
  "woodland-later": "Later woodland",
};

export function totals(stations: Station[]) {
  const sum = (pick: (s: Station) => number | null) =>
    stations.reduce((total, s) => total + (pick(s) ?? 0), 0);
  return {
    stations: stations.length,
    unconstrained_ha: sum((s) => s.unconstrained_ha),
    units_40: sum((s) => s.units_40),
    units_50: sum((s) => s.units_50),
    well_connected: stations.filter((s) => s.well_connected).length,
    byNation: Object.keys(NATIONS).map((nation) => ({
      nation: nation as Station["nation"],
      stations: stations.filter((s) => s.nation === nation).length,
      units_40: stations
        .filter((s) => s.nation === nation)
        .reduce((total, s) => total + (s.units_40 ?? 0), 0),
    })),
  };
}

export const whole = (value: number | null | undefined) =>
  value == null ? "–" : Math.round(value).toLocaleString("en-GB");
export const hectares = (value: number | null | undefined) =>
  value == null ? "–" : `${value.toLocaleString("en-GB", { maximumFractionDigits: 1 })} ha`;
export const percent = (value: number | null | undefined) =>
  value == null ? "–" : `${(value * 100).toLocaleString("en-GB", { maximumFractionDigits: 0 })}%`;
export const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
