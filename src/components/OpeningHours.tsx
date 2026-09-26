"use client";

import { useEffect, useState } from "react";
import { openingHours, clinicClock, isOpenNow } from "@/lib/site";

/**
 * The "today" highlight is applied after mount: the clinic's weekday depends on
 * its own timezone, and computing it on the server would risk a hydration mismatch.
 */
export default function OpeningHours() {
  const [today, setToday] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setToday(clinicClock().day);
      setOpen(isOpenNow());
    };
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hours-list">
      {openingHours.map((h, i) => (
        <div className={`hours-row${today === i ? " today" : ""}`} key={h.day}>
          <span className="h-day">{h.day}</span>
          <span>
            {h.label}
            {today === i && (
              <em className={`hours-flag${open ? "" : " closed"}`}>{open ? "Open now" : "Closed now"}</em>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
