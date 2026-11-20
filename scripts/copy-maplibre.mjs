// MapLibre runs its tiles through a web worker loaded by address, which Next's bundler does not
// serve; the worker and the module it imports are copied into public/ before each build.
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("public/maplibre", { recursive: true });
for (const name of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(`node_modules/maplibre-gl/dist/${name}`, `public/maplibre/${name}`);
}
