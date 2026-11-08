import Clock from "./Clock";

export default function Home() {
  return (
    <main>
      <div className="mark" aria-label="Plintoo">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect width="64" height="64" fill="#fff" />
          <path fill="#000" d="M14 14h36v36h-8V22H22v28h-8z" />
        </svg>
        <b>PLINTOO</b>
      </div>
      <div className="rule" aria-hidden="true" />
      <p className="line">In private pilot with a small group of practices.</p>
      <a className="ask" href="mailto:ralf@deixis.design?subject=Plintoo%20access">
        Request access <span aria-hidden="true">→</span>
      </a>
      <Clock />
    </main>
  );
}
