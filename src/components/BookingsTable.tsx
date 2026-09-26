"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDayShort, formatTime, relativeDay, toDateKey } from "@/lib/format";
import { clinicDateKey, telTo, whatsappTo } from "@/lib/site";
import { bookingStatuses, type AdminBooking, type BookingStatus } from "@/lib/types";
import { IconSearch, IconX, IconPhone, IconWhatsApp, IconTrash } from "@/components/Icons";

export default function BookingsTable({
  initialBookings,
  initialStatus = "all"
}: {
  initialBookings: AdminBooking[];
  initialStatus?: BookingStatus | "all";
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [status, setStatus] = useState<BookingStatus | "all">(initialStatus);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const todayKey = clinicDateKey();

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: bookings.length };
    for (const b of bookings) map[b.status] = (map[b.status] ?? 0) + 1;
    return map;
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (status !== "all" && b.status !== status) return false;
      if (!q) return true;
      return (
        b.ownerName.toLowerCase().includes(q) ||
        b.petName.toLowerCase().includes(q) ||
        b.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
        (b.service?.name ?? "General appointment").toLowerCase().includes(q)
      );
    });
  }, [bookings, status, search]);

  async function updateStatus(id: string, next: string) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Couldn't update that appointment.");
        return;
      }
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: next as BookingStatus } : b))
      );
      router.refresh();
    } catch {
      setError("Network problem — the status may not have saved.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string, petName: string) {
    if (!confirm(`Delete the appointment for ${petName}? This can't be undone.`)) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Couldn't delete that appointment.");
        return;
      }
      setBookings((prev) => prev.filter((b) => b.id !== id));
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="empty">
        <h3>No appointment requests yet</h3>
        <p>Requests submitted from the services page land here straight away.</p>
      </div>
    );
  }

  return (
    <>
      <div className="store-controls">
        <div className="controls-row">
          <div className="search-wrap">
            <IconSearch />
            <input
              className="search-input"
              type="search"
              placeholder="Search owner, pet, phone or service…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search appointments"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")} aria-label="Clear search">
                <IconX />
              </button>
            )}
          </div>
        </div>
        <div className="category-pills" role="group" aria-label="Filter by status">
          {(["all", ...bookingStatuses] as const).map((s) => (
            <button
              key={s}
              className={`pill${status === s ? " pill-active" : ""}`}
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
            >
              {s === "all" ? "All" : s} ({counts[s] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {error && <div className="err">{error}</div>}

      <p className="result-count">
        {filtered.length} of {bookings.length} appointment{bookings.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="empty">
          <h3>Nothing matched that</h3>
          <p>Try another search term or clear the status filter.</p>
          <button
            className="btn"
            onClick={() => {
              setSearch("");
              setStatus("all");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>When</th>
                <th>Pet &amp; owner</th>
                <th>Service</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Contact</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const isToday = toDateKey(b.preferredDate) === todayKey;
                return (
                  <tr key={b.id} className={isToday && b.status !== "cancelled" ? "row-warn" : undefined}>
                    <td>
                      <strong>{formatDayShort(b.preferredDate)}</strong>
                      <br />
                      <small className="muted">
                        {formatTime(b.preferredDate)} · {relativeDay(b.preferredDate, todayKey)}
                      </small>
                    </td>
                    <td>
                      <strong>{b.petName}</strong>
                      <br />
                      <small className="muted">{b.ownerName}</small>
                    </td>
                    <td>{b.service?.name ?? "General appointment"}</td>
                    <td style={{ maxWidth: 200 }}>{b.notes || "—"}</td>
                    <td>
                      <select
                        className="status-select"
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        disabled={busyId === b.id}
                        aria-label={`Status for ${b.petName}`}
                      >
                        {bookingStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="cell-actions">
                        <a
                          className="btn btn-sm"
                          href={telTo(b.phone)}
                          aria-label={`Call ${b.ownerName}`}
                          title={b.phone}
                        >
                          <IconPhone />
                        </a>
                        <a
                          className="btn btn-sm"
                          href={whatsappTo(
                            b.phone,
                            `Hello ${b.ownerName}, about ${b.petName}'s ${(b.service?.name ?? "general")} appointment on ${formatDayShort(b.preferredDate)} at ${formatTime(b.preferredDate)} —`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`WhatsApp ${b.ownerName}`}
                        >
                          <IconWhatsApp />
                        </a>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(b.id, b.petName)}
                        disabled={busyId === b.id}
                        aria-label={`Delete appointment for ${b.petName}`}
                      >
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
