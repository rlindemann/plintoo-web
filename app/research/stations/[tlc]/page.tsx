import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { day, hectares, HISTORY_KINDS, NATIONS, percent, study, whole } from "@/lib/stations";
import StationPlate from "./StationPlate";

export const dynamicParams = false;

export function generateStaticParams() {
  return study().stations.map((s) => ({ tlc: s.tlc.toLowerCase() }));
}

function find(tlc: string) {
  return study().stations.find((s) => s.tlc.toLowerCase() === tlc);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tlc: string }>;
}): Promise<Metadata> {
  const station = find((await params).tlc);
  return {
    title: station ? `${station.station} · Station study · Plintoo` : "Station study · Plintoo",
    robots: { index: false, follow: false },
  };
}

const yes = (value: boolean | null) => (value == null ? "–" : value ? "Yes" : "No");

export default async function StationPage({ params }: { params: Promise<{ tlc: string }> }) {
  const station = find((await params).tlc);
  if (!station) notFound();
  const { constraints, history, assets, sources } = study();
  const land = history[station.tlc] ?? [];
  const designations = land.filter((row) => row[0] in HISTORY_KINDS && (row[3] ?? 0) > 0);
  const homes = land.filter((row) => row[0] === "homes" && (row[4] ?? 0) > 0);
  const most = Math.max(1, ...homes.map((row) => row[4] ?? 0));
  const photos = assets[station.tlc] ?? [];
  const centre: [number, number] | null =
    station.longitude != null && station.latitude != null
      ? [station.longitude, station.latitude]
      : null;

  const head = (
    <>
      <section>
        <p className="kicker">
          <Link href="/research/stations">Station study</Link> · {station.tlc}
        </p>
        <h1>{station.station}</h1>
        <p className="where">
          {[station.local_authority, station.region, NATIONS[station.nation]].filter(Boolean).join(" · ")}
        </p>
      </section>
      <section>
        <dl className="figs">
          <div className="wide big">
            <dt>Homes at 40 a hectare</dt>
            <dd>{whole(station.units_40)}</dd>
          </div>
          <div>
            <dt>Homes at 50 a hectare</dt>
            <dd>{whole(station.units_50)}</dd>
          </div>
          <div>
            <dt>Free land</dt>
            <dd>{hectares(station.unconstrained_ha)}</dd>
          </div>
          <div>
            <dt>Constrained</dt>
            <dd>{percent(station.constrained_share)}</dd>
          </div>
          <div>
            <dt>Parcels that count</dt>
            <dd>{whole(station.parcels)}</dd>
          </div>
        </dl>
      </section>
    </>
  );

  return (
    <main className="page plate">
      <StationPlate
        tlc={station.tlc}
        centre={centre}
        rows={constraints[station.tlc] ?? []}
        parcels={{ count: station.parcels, ha: station.parcel_ha, units: station.units_40 }}
        head={head}
      >
        {photos.length > 0 && (
          <section>
            <h2>Assets</h2>
            <ul className="photos">
              {photos.map((photo) => (
                <li key={photo.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                  <span>{photo.credit}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section>
          <h2>Use and service</h2>
          <dl className="pairs">
            <dt>Entries and exits{station.usage_period ? `, ${station.usage_period}` : ""}</dt>
            <dd>{whole(station.entries_exits)}</dd>
            <dt>Fewest trains an hour, weekday daytime</dt>
            <dd>{station.trains_per_hour_min_daytime ?? "–"}</dd>
            <dt>Well connected (NPPF)</dt>
            <dd>{yes(station.well_connected)}</dd>
            <dt>Reaches the Green Belt</dt>
            <dd>{yes(station.in_green_belt)}</dd>
            <dt>Reaches a National Landscape</dt>
            <dd>{yes(station.in_national_landscape)}</dd>
          </dl>
        </section>
        {(designations.length > 0 || homes.length > 0) && (
          <section>
            <h2>The land's history</h2>
            {designations.length > 0 && (
              <dl className="pairs">
                {designations.map((row) => (
                  <div className="pair" key={row[0]}>
                    <dt>{HISTORY_KINDS[row[0]]}</dt>
                    <dd>
                      {whole(row[3])}
                      {row[5] ? ` · ${hectares(row[5])}` : ""}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {homes.length > 0 && (
              <>
                <p className="note" style={{ margin: "12px 0 6px" }}>
                  Homes by when they were built, from the Valuation Office's build periods
                </p>
                <ul className="bars">
                  {homes.map((row) => (
                    <li key={`${row[1]}-${row[2]}`}>
                      <span>{row[2] ?? row[1]}</span>
                      <span className="track" aria-hidden="true">
                        <span className="fill" style={{ width: `${((row[4] ?? 0) / most) * 100}%` }} />
                      </span>
                      <span className="value">{whole(row[4])}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}
        <section>
          <p className="note" style={{ margin: 0 }}>
            Plintoo Data, exported {day(sources.exported_at)}.{" "}
            <Link href="/research/stations#method">Method and sources</Link>
          </p>
        </section>
      </StationPlate>
    </main>
  );
}
