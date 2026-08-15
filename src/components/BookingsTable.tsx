"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

const statusOptions = ["pending", "confirmed", "completed", "cancelled"] as const;

export default function BookingsTable({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        alert("Failed to update status.");
        return;
      }
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: status as Booking["status"] } : b)));
      router.refresh();
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this booking?")) return;
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete booking.");
      return;
    }
    setBookings((prev) => prev.filter((b) => b.id !== id));
    router.refresh();
  }

  if (bookings.length === 0) {
    return <div className="empty">No appointment requests yet.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Owner</th>
          <th>Phone</th>
          <th>Pet</th>
          <th>Service</th>
          <th>Notes</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((b) => (
          <tr key={b.id}>
            <td>{b.preferredDate}</td>
            <td>{b.ownerName}</td>
            <td>{b.phone}</td>
            <td>{b.petName}</td>
            <td>{b.service.name}</td>
            <td style={{ maxWidth: 180 }}>{b.notes || "-"}</td>
            <td>
              <select
                value={b.status}
                onChange={(e) => updateStatus(b.id, e.target.value)}
                disabled={updatingId === b.id}
                style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13 }}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </td>
            <td>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
