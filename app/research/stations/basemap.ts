import { setWorkerUrl } from "maplibre-gl";

// MapLibre's worker, copied into public/ by scripts/copy-maplibre.mjs.
setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

// The ground under every research map: OpenFreeMap's vector styles, which need no key or account.
// Light or dark follows the reader's setting, as the platform's map viewer does.
export const BASEMAP = {
  light: "https://tiles.openfreemap.org/styles/positron",
  dark: "https://tiles.openfreemap.org/styles/dark",
};

export function prefersDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ink() {
  return prefersDark()
    ? { fg: "#f2f2f2", bg: "#0b0b0b", muted: "#8f8f8f" }
    : { fg: "#111111", bg: "#ffffff", muted: "#6b6b6b" };
}
