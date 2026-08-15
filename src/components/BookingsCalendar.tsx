"use client";

import { useMemo, useState } from "react";

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

const statusColors: Record<string, string> = {
  pending: "#c0392b",
  confirmed: "#1d7a5f",
  completed: "#6b7570",
  cancelled: "#b5b8b5"
};

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function BookingsCalendar({ bookings }: { bookings: Booking[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const byDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
      const arr = map.get(b.preferredDate) || [];
      arr.push(b);
      map.set(b.preferredDate, arr);
    }
    return map;
  }, [bookings]);

  const cells = getMonthGrid(year, month);
  const monthLabel = new Date(year, month, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const todayStr = today.toISOString().slice(0, 10);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1);
    setSelectedDate(null);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1);
    setSelectedDate(null);
  }

  const selectedBookings = selectedDate ? byDate.get(selectedDate) || [] : [];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "14px 14px 0 0",
          padding: "14px 18px"
        }}
      >
        <button className="btn btn-sm" onClick={prevMonth}>← Prev</button>
        <h3 style={{ margin: 0, fontSize: 17, color: "var(--green-dark)" }}>{monthLabel}</h3>
        <button className="btn btn-sm" onClick={nextMonth}>Next →</button>
      </div>

      <div
        style={{
          border: "1px solid var(--border)",
          borderTop: "none",
          borderRadius: "0 0 14px 14px",
          padding: 16,
          background: "var(--card)"
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 6 }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textAlign: "center", padding: "4px 0" }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
          {cells.map((day, i) => {
            if (day === null) return <div key={i} style={{ minHeight: 84 }} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayBookings = byDate.get(dateStr) || [];
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(dayBookings.length > 0 ? (isSelected ? null : dateStr) : null)}
                style={{
                  minHeight: 84,
                  border: isSelected ? "2px solid var(--green)" : isToday ? "2px solid var(--green-light)" : "1px solid var(--border)",
                  borderRadius: 10,
                  padding: 8,
                  background: dayBookings.length > 0 ? "var(--green-light)" : "#fff",
                  cursor: dayBookings.length > 0 ? "pointer" : "default",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "all 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4
                }}
              >
                <div style={{
                  fontSize: 12,
                  fontWeight: isToday ? 800 : 600,
                  color: isToday ? "var(--green-dark)" : "var(--text)"
                }}>
                  {day}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {dayBookings.slice(0, 2).map((b) => (
                    <div
                      key={b.id}
                      style={{
                        fontSize: 10.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "var(--text)",
                        background: "#fff",
                        borderRadius: 5,
                        padding: "2px 5px"
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColors[b.status], flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.petName}</span>
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div style={{ fontSize: 10, color: "var(--green-dark)", fontWeight: 600 }}>+{dayBookings.length - 2} more</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 12, color: "var(--muted)", flexWrap: "wrap" }}>
          {Object.entries(statusColors).map(([status, color]) => (
            <span key={status} style={{ display: "flex", alignItems: "center", gap: 5, textTransform: "capitalize" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
              {status}
            </span>
          ))}
        </div>
      </div>

      {selectedDate && selectedBookings.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3 className="section" style={{ fontSize: 16 }}>
            Appointments on {selectedDate}
          </h3>
          <table>
            <thead>
              <tr><th>Owner</th><th>Pet</th><th>Service</th><th>Phone</th><th>Status</th></tr>
            </thead>
            <tbody>
              {selectedBookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.ownerName}</td>
                  <td>{b.petName}</td>
                  <td>{b.service.name}</td>
                  <td>{b.phone}</td>
                  <td>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, textTransform: "capitalize" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColors[b.status] }} />
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}