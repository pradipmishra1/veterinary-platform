"use client";

import { useState } from "react";
import BookingsTable from "@/components/BookingsTable";
import BookingsCalendar from "@/components/BookingsCalendar";

type Booking = {
  id: string;
  ownerName: string;
  phone: string;
  petName: string;
  preferredDate: string;
  notes: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  service: { name: string; price: number };
};

export default function BookingsCalendarWrapper({ bookings }: { bookings: Booking[] }) {
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <>
      <div className="toolbar">
        <div style={{ display: "flex", gap: 8 }}>
          <button className={`pill ${view === "list" ? "pill-active" : ""}`} onClick={() => setView("list")}>List</button>
          <button className={`pill ${view === "calendar" ? "pill-active" : ""}`} onClick={() => setView("calendar")}>Calendar</button>
        </div>
      </div>
      {view === "list" ? <BookingsTable initialBookings={bookings} /> : <BookingsCalendar bookings={bookings} />}
    </>
  );
}