"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// [tlc, name, nation, local_authority, units_40, unconstrained_ha, constrained_share, entries_exits, well_connected]
export type Row = [string, string, string, string, number | null, number | null, number | null, number | null, boolean | null];

const COLUMNS: { label: string; index: number; numeric: boolean }[] = [
  { label: "Station", index: 1, numeric: false },
  { label: "Local authority", index: 3, numeric: false },
  { label: "Homes at 40/ha", index: 4, numeric: true },
  { label: "Free land", index: 5, numeric: true },
  { label: "Constrained", index: 6, numeric: true },
  { label: "Entries and exits a year", index: 7, numeric: true },
];

const NATIONS: Record<string, string> = {
  "": "Every nation",
  england: "England",
  wales: "Wales",
  scotland: "Scotland",
  "northern-ireland": "Northern Ireland",
};

const show = (index: number, value: unknown) => {
  if (value == null) return "–";
  if (index === 5) return `${(value as number).toLocaleString("en-GB", { maximumFractionDigits: 1 })} ha`;
  if (index === 6) return `${Math.round((value as number) * 100)}%`;
  if (typeof value === "number") return value.toLocaleString("en-GB");
  return String(value);
};

export default function StationTable({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");
  const [nation, setNation] = useState("");
  const [sort, setSort] = useState({ index: 4, descending: true });
  const [all, setAll] = useState(false);

  const chosen = useMemo(() => {
    const words = query.trim().toLowerCase();
    const kept = rows.filter(
      (row) =>
        (!nation || row[2] === nation) &&
        (!words || `${row[1]} ${row[3]} ${row[0]}`.toLowerCase().includes(words)),
    );
    return kept.sort((a, b) => {
      const x = a[sort.index] as number | string | null;
      const y = b[sort.index] as number | string | null;
      if (x == null) return 1;
      if (y == null) return -1;
      const order = typeof x === "number" ? x - (y as number) : String(x).localeCompare(String(y));
      return sort.descending ? -order : order;
    });
  }, [rows, query, nation, sort]);

  const shown = all ? chosen : chosen.slice(0, 50);

  return (
    <div className="table">
      <div className="controls">
        <label>
          Find a station
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, code or local authority"
          />
        </label>
        <label>
          Nation
          <select value={nation} onChange={(event) => setNation(event.target.value)}>
            {Object.entries(NATIONS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="scroll">
        <table>
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column.label}
                  className={column.numeric ? "num" : undefined}
                  aria-sort={
                    sort.index === column.index ? (sort.descending ? "descending" : "ascending") : "none"
                  }
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSort((now) => ({
                        index: column.index,
                        descending: now.index === column.index ? !now.descending : column.numeric,
                      }))
                    }
                  >
                    {column.label}
                    {sort.index === column.index ? (sort.descending ? " ↓" : " ↑") : ""}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              <tr key={row[0]}>
                {COLUMNS.map((column) => (
                  <td key={column.label} className={column.numeric ? "num" : undefined}>
                    {column.index === 1 ? (
                      <Link href={`/research/stations/${row[0].toLowerCase()}`}>{row[1]}</Link>
                    ) : (
                      show(column.index, row[column.index])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="count">
        {chosen.length.toLocaleString("en-GB")} stations
        {!all && chosen.length > 50 ? (
          <>
            , the first 50 shown.{" "}
            <button type="button" className="link" onClick={() => setAll(true)}>
              Show all
            </button>
          </>
        ) : (
          "."
        )}
      </p>
    </div>
  );
}
