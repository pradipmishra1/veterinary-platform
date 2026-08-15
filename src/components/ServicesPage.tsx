"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";

type Service = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  durationMin: number | null;
  description: string | null;
  imageUrl: string | null;
};

function formatPrice(n: number) {
  return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ServicesPage({ services }: { services: Service[] }) {
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [form, setForm] = useState({ ownerName: "", phone: "", petName: "", preferredDate: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function openBooking(s: Service) {
    setBookingService(s);
    setForm({ ownerName: "", phone: "", petName: "", preferredDate: "", notes: "" });
    setError("");
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bookingService) return;
    setError("");

    if (!form.ownerName.trim() || !form.phone.trim() || !form.petName.trim() || !form.preferredDate) {
      setError("Please fill in your name, phone, pet's name, and preferred date.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: bookingService.id,
          ownerName: form.ownerName.trim(),
          phone: form.phone.trim(),
          petName: form.petName.trim(),
          preferredDate: form.preferredDate,
          notes: form.notes.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit booking.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader
        title="Clinic services"
        subtitle="Injections, vaccinations, checkups and more — book an appointment below."
        active="services"
      />

      <div className="wrap">
        {services.length === 0 ? (
          <div className="empty">No services listed yet.</div>
        ) : (
          <div className="grid">
            {services.map((s, i) => (
              <div className="card" key={s.id} style={{ animationDelay: `${i * 0.05}s` }}>
                {s.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.imageUrl} alt={s.name} />
                ) : (
                  <div style={{ height: 150, background: "#eee" }} />
                )}
                <div className="body">
                  {s.category && <span className="badge">{s.category}</span>}
                  <h3>{s.name}</h3>
                  {s.description && <p className="desc">{s.description}</p>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="price">{formatPrice(s.price)}</div>
                    {s.durationMin && <span className="sub" style={{ margin: 0 }}>{s.durationMin} min</span>}
                  </div>
                  <button className="btn btn-primary" onClick={() => openBooking(s)}>
                    Book appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {bookingService && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setBookingService(null); }}
        >
          <div style={{ background: "#fff", borderRadius: 14, padding: 26, width: 440, maxWidth: "92vw", maxHeight: "88vh", overflow: "auto" }}>
            {success ? (
              <>
                <h2 style={{ marginTop: 0, fontSize: 18 }}>Booking request sent</h2>
                <p className="sub">
                  We've received your request for {bookingService.name}. The clinic will contact you at{" "}
                  {form.phone} to confirm.
                </p>
                <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setBookingService(null)}>
                  Done
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ marginTop: 0, fontSize: 18 }}>Book: {bookingService.name}</h2>
                <div className="field">
                  <label>Your name</label>
                  <input value={form.ownerName} onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))} required />
                </div>
                <div className="field">
                  <label>Phone number</label>
                  <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
                </div>
                <div className="field">
                  <label>Pet's name</label>
                  <input value={form.petName} onChange={(e) => setForm((f) => ({ ...f, petName: e.target.value }))} required />
                </div>
                <div className="field">
                  <label>Preferred date</label>
                  <input type="date" value={form.preferredDate} onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))} required />
                </div>
                <div className="field">
                  <label>Notes (optional)</label>
                  <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Anything the vet should know" />
                </div>
                {error && <div className="err">{error}</div>}
                <div className="form-actions">
                  <button type="button" className="btn" onClick={() => setBookingService(null)}>Cancel</button>
                  <button className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Submitting…" : "Request appointment"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}