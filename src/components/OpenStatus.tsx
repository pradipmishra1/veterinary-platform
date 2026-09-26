"use client";

import { useEffect, useState } from "react";
import { isOpenNow, todayHours } from "@/lib/site";

/**
 * Rendered client-side only: the server's clock/timezone can't be trusted for
 * "open now", and a mismatch would trip hydration.
 */
export default function OpenStatus() {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    const update = () => setStatus({ open: isOpenNow(), label: todayHours().label });
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!status) return null;

  return (
    <span className={`hero-eyebrow${status.open ? "" : " closed"}`}>
      <span className="live-dot" />
      {status.open ? `Open now · ${status.label}` : `Closed now · Today ${status.label}`}
    </span>
  );
}
