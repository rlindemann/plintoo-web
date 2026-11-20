import Link from "next/link";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "./research.css";

// Research pages are built but kept unlisted: the whole site is noindex (app/layout.tsx) and
// robots.txt disallows everything, and nothing on the home page links here. The station study
// was made for a client report, so it stays hidden until the client agrees what may be shown
// (PRD decision 14).
export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="research">
      <header className="bar">
        <Link href="/" className="brand" aria-label="Plintoo home">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <rect width="64" height="64" />
            <path d="M14 14h36v36h-8V22H22v28h-8z" />
          </svg>
          <b>PLINTOO</b>
        </Link>
        <nav aria-label="Research">
          <Link href="/research">Research</Link>
          <Link href="/research/stations">Stations</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
