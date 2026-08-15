"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Service = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  durationMin: number | null;
  imageUrl: string | null;
};

function formatPrice(n: number) {
  return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ServicesTable({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete service.");
        return;
      }
      setServices((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  if (services.length === 0) {
    return <div className="empty">No services yet. Click "Add service" to create one.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Duration</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {services.map((s) => (
          <tr key={s.id}>
            <td>
              {s.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="thumb" src={s.imageUrl} alt={s.name} />
              ) : (
                <div className="thumb" />
              )}
            </td>
            <td>{s.name}</td>
            <td>{s.category || "-"}</td>
            <td>{formatPrice(s.price)}</td>
            <td>{s.durationMin ? `${s.durationMin} min` : "-"}</td>
            <td style={{ display: "flex", gap: 6 }}>
              <a className="btn btn-sm" href={`/vetsuppose/services/${s.id}/edit`}>Edit</a>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(s.id)}
                disabled={deletingId === s.id}
              >
                {deletingId === s.id ? "Deleting…" : "Delete"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}