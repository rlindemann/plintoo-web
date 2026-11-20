import type { Metadata } from "next";
import { day, hectares, NATIONS, study, totals, whole } from "@/lib/stations";
import Overview, { type Row } from "./Overview";

export const metadata: Metadata = {
  title: "Land around every railway station · Plintoo research",
  robots: { index: false, follow: false },
};

export default function StationsStudy() {
  const { stations, sources } = study();
  const all = totals(stations);
  const rows: Row[] = stations.map((s) => [
    s.tlc,
    s.station,
    s.nation,
    s.local_authority ?? "",
    s.longitude,
    s.latitude,
    s.units_40,
    s.unconstrained_ha,
    s.constrained_share,
    s.entries_exits,
  ]);
  const unplaced = stations.filter((s) => s.latitude == null).length;

  return (
    <main className="page plate">
      <Overview rows={rows}>
        <section>
          <p className="kicker">Research · Station study</p>
          <h1>Land around every railway station</h1>
          <p className="where">
            How much land within 1 km of each station is free of constraints, and the homes it
            could hold.
          </p>
        </section>
        <section>
          <dl className="figs">
            <div className="wide big">
              <dt>Homes at 40 a hectare</dt>
              <dd>{whole(all.units_40)}</dd>
            </div>
            <div>
              <dt>Stations</dt>
              <dd>{whole(all.stations)}</dd>
            </div>
            <div>
              <dt>Free land</dt>
              <dd>{hectares(all.unconstrained_ha)}</dd>
            </div>
            <div>
              <dt>Homes at 50 a hectare</dt>
              <dd>{whole(all.units_50)}</dd>
            </div>
            <div>
              <dt>Well connected (NPPF)</dt>
              <dd>{whole(all.well_connected)}</dd>
            </div>
          </dl>
        </section>
        <section>
          <h2>By nation</h2>
          <dl className="pairs">
            {all.byNation.map((x) => (
              <div className="pair" key={x.nation}>
                <dt>
                  {NATIONS[x.nation]} · {whole(x.stations)} stations
                </dt>
                <dd>{whole(x.units_40)} homes</dd>
              </div>
            ))}
          </dl>
          {unplaced > 0 && (
            <p className="note">
              Northern Ireland's {whole(unplaced)} stations are listed but not mapped: the station
              counts that give positions do not cover them.
            </p>
          )}
        </section>
        <StudyNotes sources={sources} />
      </Overview>
    </main>
  );
}

function StudyNotes({ sources }: { sources: ReturnType<typeof study>["sources"] }) {
  return (
    <>
      <section className="prose" id="method">
        <h2>Method</h2>
        <p>
          Each station gets a circle of 1 km. Every constraint inside it is mapped from the station's
          own nation's sources and unioned: flood zone 3, SSSIs, scheduled monuments, registered
          parks, gardens and battlefields, listed buildings, ancient woodland and 30 m around it,
          priority habitats, rivers and 10 m either side, buildings and 10 m around them, and road
          and rail noise over 50 dB. Wales' noise maps are not read, their licence not being stated.
        </p>
        <p>
          The rest is free land. In England and Wales it is counted on HM Land Registry's INSPIRE
          parcels with 0.1 ha or more of it not built on; in Scotland and Northern Ireland, on the
          separate pieces of free land. Homes are those parcels at 40 and 50 a hectare.
        </p>
        <p>
          Green Belt, National Landscapes and slopes steeper than 1 in 10 are flagged, not taken
          out. A first screen, not a site assessment: access, ownership, viability and policy are
          not weighed.
        </p>
      </section>
      <section id="sources">
        <h2>Sources</h2>
        <ul className="sources">
          {sources.products.map((p) => (
            <li key={p.dataset}>
              {p.title}, {p.version} of {day(p.created_at)}
            </li>
          ))}
        </ul>
        <p className="note">Plintoo Data, exported {day(sources.exported_at)}.</p>
      </section>
    </>
  );
}
