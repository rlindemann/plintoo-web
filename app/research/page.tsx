import type { Metadata } from "next";
import Link from "next/link";
import { day, study, whole } from "@/lib/stations";

export const metadata: Metadata = {
  title: "Research · Plintoo",
  robots: { index: false, follow: false },
};

export default function Research() {
  const { stations, sources } = study();
  return (
    <main className="page">
      <section style={{ padding: "16px", borderBottom: "1px solid var(--line)" }}>
        <p className="kicker">Research</p>
        <h1>Studies made with Plintoo</h1>
      </section>
      <ul className="studies">
        <li>
          <Link href="/research/stations">
            <h2>Land around every railway station</h2>
            <p>
              How much land within 1 km of each of {whole(stations.length)} stations is free of
              constraints, and how many homes it could hold.
            </p>
            <p className="note">Great Britain and Northern Ireland · data of {day(sources.products[0].created_at)}</p>
          </Link>
        </li>
      </ul>
    </main>
  );
}
