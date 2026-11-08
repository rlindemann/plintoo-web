"use client";

import { useState } from "react";

const EMAIL = "ralf@deixis.design";

export default function Ask() {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  const onClick = () => {
    setShown(true);
    navigator.clipboard?.writeText(EMAIL).then(
      () => setCopied(true),
      () => setCopied(false),
    );
  };

  return (
    <div className="askwrap">
      <a className="ask" href={`mailto:${EMAIL}?subject=Plintoo%20access`} onClick={onClick}>
        Request access <span aria-hidden="true">→</span>
      </a>
      <p className="addr" aria-live="polite">
        {shown ? (
          <>
            {EMAIL}
            {copied && <span> · copied</span>}
          </>
        ) : (
          " "
        )}
      </p>
    </div>
  );
}
