import type { Metadata } from "next";
import { day, hectares, NATIONS, study, totals, whole } from "@/lib/stations";
import StationMap, { type Dot } from "./StationMap";
import StationTable, { type Row } from "./StationTable";

export const metadata: Metadata = {
  title: "Land around every railway station · Plintoo research",
  robots: { index: false, follow: false },
};

// A flat projection good enough for a dot map of Great Britain: longitude squeezed by the cosine
// of the middle latitude, so the island keeps its shape.
const SCALE = 100;
const SQUEEZE = Math.cos((54.5 * Math.PI) / 180);

export default function StationsStudy() {
  const { stations, sources } = study();
  const all = totals(stations);

  const placed = stations.filter((s) => s.latitude != null && s.longitude != null);
  const xs = placed.map((s) => s.longitude! * SQUEEZE * SCALE);
  const ys = placed.map((s) => -s.latitude! * SCALE);
  const [left, top] = [Math.min(...xs) - 10, Math.min(...ys) - 10];
  const width = Math.max(...xs) - left + 10;
  const height = Math.max(...ys) - top + 10;
  const dots: Dot[] = placed.map((s, i) => [
    s.tlc,
    s.station,
    Math.round((xs[i] - left) * 10) / 10,
    Math.round((ys[i] - top) * 10) / 10,
    s.units_40 ?? 0,
    s.constrained_share ?? 1,
    s.nation,
  ]);
  const rows: Row[] = stations.map((s) => [
    s.tlc,
    s.station,
    s.nation,
    s.local_authority ?? "",
    s.units_40,
    s.unconstrained_ha,
    s.constrained_share,
    s.entries_exits,
    s.well_connected,
  ]);
  const unplaced = stations.length - placed.length;

  return (
    <main className="page">
      <p className="eyebrow">Research · Station study</p>
      <h1>Land around every railway station</h1>
      <p className="lede">
        For every station in Great Britain and Northern Ireland: how much of the land within 1 km
        is free of planning and physical constraints, and how many homes that free land could
        hold.
      </p>

      <dl className="figures">
        <div>
          <dt>Stations</dt>
          <dd>{whole(all.stations)}</dd>
        </div>
        <div>
          <dt>Free land in their circles</dt>
          <dd>{hectares(all.unconstrained_ha)}</dd>
        </div>
        <div>
          <dt>Homes at 40 a hectare</dt>
          <dd>{whole(all.units_40)}</dd>
        </div>
        <div>
          <dt>Homes at 50 a hectare</dt>
          <dd>{whole(all.units_50)}</dd>
        </div>
        <div>
          <dt>Well connected (NPPF test)</dt>
          <dd>{whole(all.well_connected)}</dd>
        </div>
      </dl>

      <section aria-labelledby="map">
        <h2 id="map">Every station</h2>
        <StationMap dots={dots} width={width} height={height} />
        {unplaced > 0 && (
          <p className="note">
            {whole(unplaced)} stations in Northern Ireland are in the table but not on the map: the
            station counts used for positions do not cover them.
          </p>
        )}
      </section>

      <section aria-labelledby="nations">
        <h2 id="nations">By nation</h2>
        <div className="scroll">
          <table className="compact">
            <thead>
              <tr>
                <th>Nation</th>
                <th className="num">Stations</th>
                <th className="num">Homes at 40/ha</th>
              </tr>
            </thead>
            <tbody>
              {all.byNation.map((n) => (
                <tr key={n.nation}>
                  <td>{NATIONS[n.nation]}</td>
                  <td className="num">{whole(n.stations)}</td>
                  <td className="num">{whole(n.units_40)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="stations">
        <h2 id="stations">Find a station</h2>
        <StationTable rows={rows} />
      </section>

      <section aria-labelledby="method" className="prose">
        <h2 id="method">Method</h2>
        <p>
          Each station gets a circle of 1 km around it. Within the circle, every constraint is
          mapped from the national sources of the station's own nation and unioned: flood zone 3,
          Sites of Special Scientific Interest, scheduled monuments, registered parks, gardens and
          battlefields, listed buildings, ancient woodland and 30 m around it, priority habitats,
          rivers and 10 m either side, existing buildings and 10 m around them, and road and rail
          noise louder than 50 dB. Wales' noise maps are not read (their licence is not stated), so
          noise is not among a Welsh station's constraints.
        </p>
        <p>
          What is left is the free land. In England and Wales it is counted on HM Land Registry's
          INSPIRE polygons, keeping parcels with 0.1 ha or more of it that are not built on; in
          Scotland and Northern Ireland, which have no open register of land parcels, on the
          separate pieces of free land. Homes are those parcels at 40 and 50 dwellings a hectare,
          each rounded down.
        </p>
        <p>
          Green Belt, National Landscapes and slopes steeper than 1 in 10 are shown as flags,
          not taken out: they are policy or design questions, not physical limits.
        </p>
        <p>
          This is a first screen of where homes could go near stations, not a site assessment:
          access, ownership, viability and policy are not weighed.
        </p>
      </section>

      <section aria-labelledby="sources" className="prose">
        <h2 id="sources">Sources</h2>
        <ul className="sources">
          {sources.products.map((p) => (
            <li key={p.dataset}>
              <b>{p.title}</b>, version {p.version.slice(1)} of {day(p.created_at)},{" "}
              {whole(p.rows)} rows. Built from{" "}
              {Object.values(p.from)
                .map((entry) => entry.split(" ")[0])
                .join(", ")}
              .
            </li>
          ))}
        </ul>
        <p className="note">Plintoo Data, exported {day(sources.exported_at)}.</p>
      </section>
    </main>
  );
}
