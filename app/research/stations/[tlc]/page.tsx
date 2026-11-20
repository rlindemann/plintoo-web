import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CONSTRAINT_KINDS,
  day,
  hectares,
  HISTORY_KINDS,
  NATIONS,
  percent,
  study,
  whole,
} from "@/lib/stations";

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
  const rows = new Map((constraints[station.tlc] ?? []).map((row) => [row[0], row]));
  const land = history[station.tlc] ?? [];
  const designations = land.filter((row) => row[0] in HISTORY_KINDS && (row[3] ?? 0) > 0);
  const homes = land.filter((row) => row[0] === "homes" && (row[4] ?? 0) > 0);
  const homesTotal = homes.reduce((total, row) => total + (row[4] ?? 0), 0);
  const photos = assets[station.tlc] ?? [];
  const where = [station.local_authority, station.region, NATIONS[station.nation]]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="page">
      <p className="eyebrow">
        <Link href="/research/stations">Station study</Link> · {station.tlc}
      </p>
      <h1>{station.station}</h1>
      <p className="lede">{where}</p>

      <dl className="figures">
        <div>
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
          <dt>Of the 1 km circle constrained</dt>
          <dd>{percent(station.constrained_share)}</dd>
        </div>
        <div>
          <dt>Parcels that count</dt>
          <dd>
            {whole(station.parcels)} <small>({hectares(station.parcel_ha)})</small>
          </dd>
        </div>
      </dl>

      {photos.length > 0 && (
        <section aria-labelledby="assets">
          <h2 id="assets">Assets</h2>
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

      <section aria-labelledby="constraints">
        <h2 id="constraints">What constrains the land</h2>
        <p className="note">
          Share of the circle of 1 km around the station ({hectares(station.study_area_ha)}). Kinds
          marked <em>flag</em> are shown but not taken out of the free land.
        </p>
        <ul className="bars">
          {CONSTRAINT_KINDS.map(([kind, label]) => {
            const row = rows.get(kind);
            if (!row) return null;
            const [, area, share, mapped, inUnion] = row;
            return (
              <li key={kind}>
                <span className="label">
                  {label}
                  {inUnion === false && <em className="flag">flag</em>}
                </span>
                <span className="track" aria-hidden="true">
                  <span
                    className={inUnion === false ? "fill hatch" : "fill"}
                    style={{ width: `${Math.min(100, (share ?? 0) * 100)}%` }}
                  />
                </span>
                <span className="value">
                  {mapped === false ? "not mapped" : `${percent(share)} · ${hectares(area)}`}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="total">
          All constraints together: {percent(station.constrained_share)} (
          {hectares(station.constrained_ha)}). Free land: {hectares(station.unconstrained_ha)}.
        </p>
      </section>

      <section aria-labelledby="service">
        <h2 id="service">Use and service</h2>
        <dl className="pairs">
          <dt>Entries and exits {station.usage_period ? `(${station.usage_period})` : ""}</dt>
          <dd>{whole(station.entries_exits)}</dd>
          <dt>Fewest trains an hour, weekday daytime</dt>
          <dd>{station.trains_per_hour_min_daytime ?? "–"}</dd>
          <dt>Well connected (NPPF test)</dt>
          <dd>{yes(station.well_connected)}</dd>
          <dt>Reaches the Green Belt</dt>
          <dd>
            {yes(station.in_green_belt)}
            {station.in_green_belt ? ` (${percent(station.green_belt_share)})` : ""}
          </dd>
          <dt>Reaches a National Landscape</dt>
          <dd>
            {yes(station.in_national_landscape)}
            {station.in_national_landscape ? ` (${percent(station.national_landscape_share)})` : ""}
          </dd>
        </dl>
      </section>

      {(designations.length > 0 || homes.length > 0) && (
        <section aria-labelledby="history">
          <h2 id="history">The land's history</h2>
          {designations.length > 0 && (
            <dl className="pairs">
              {designations.map((row) => (
                <div key={row[0]} className="pair">
                  <dt>{HISTORY_KINDS[row[0]]}</dt>
                  <dd>
                    {whole(row[3])}
                    {row[5] ? ` · ${hectares(row[5])} (${percent(row[6])})` : ""}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {homes.length > 0 && (
            <>
              <h3>Homes by when they were built</h3>
              <ul className="bars">
                {homes.map((row) => (
                  <li key={`${row[1]}-${row[2]}`}>
                    <span className="label">{row[2] ?? row[1]}</span>
                    <span className="track" aria-hidden="true">
                      <span
                        className="fill"
                        style={{ width: `${((row[4] ?? 0) / homesTotal) * 100}%` }}
                      />
                    </span>
                    <span className="value">{whole(row[4])}</span>
                  </li>
                ))}
              </ul>
              <p className="note">Estimated, from the Valuation Office's build periods.</p>
            </>
          )}
        </section>
      )}

      <p className="note">
        Plintoo Data, exported {day(sources.exported_at)}. <Link href="/research/stations#method">Method and sources</Link>.
      </p>
    </main>
  );
}
