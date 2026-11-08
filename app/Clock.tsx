"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/London" }));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="status">
      <i />
      Pilot open · <span suppressHydrationWarning>{t}</span> London
    </div>
  );
}
