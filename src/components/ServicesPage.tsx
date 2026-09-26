"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import { site, slotsForDate, slotLabel, clinicDateKey, telHref } from "@/lib/site";
import { IconSearch, IconX, IconPaw, IconCheck, IconClock, IconPhone } from "@/components/Icons";

export type ServiceItem = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  durationMin: number | null;
  description: string | null;
  imageUrl: string | null;
};

type FormState = {
  ownerName: string;
  phone: string;
  petName: string;
  date: string;
  time: string;
  notes: string;
};

const emptyForm: FormState = { ownerName: "", phone: "", petName: "", date: "", time: "", notes: "" };
const generalAppointment: ServiceItem = {
  id: "",
  name: "General veterinary appointment",
  category: null,
  price: 0,
  durationMin: null,
  description: null,
  imageUrl: null
};

export default function ServicesPage({ services }: { services: ServiceItem[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [booking, setBooking] = useState<ServiceItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const today = clinicDateKey();
  const maxDate = useMemo(() => {
    const d = new Date(`${today}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 60);
    return d.toISOString().slice(0, 10);
  }, [today]);

  const categories = useMemo(() => {
    const set = new Set(services.map((s) => s.category).filter(Boolean) as string[]);
    return ["All", ...Array.from(set).sort()];
  }, [services]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return services.filter((s) => {
      if (category !== "All" && s.category !== category) return false;
      if (!q) return true;
      return s.name.toLowerCase().includes(q) || (s.description || "").toLowerCase().includes(q);
    });
  }, [services, search, category]);

  const slots = form.date ? slotsForDate(form.date) : [];

  function openBooking(s: ServiceItem) {
    setBooking(s);
    setForm({ ...emptyForm, date: today });
    setError("");
    setSuccess(false);
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!booking) return;
    setError("");

    if (!form.ownerName.trim() || !form.phone.trim() || !form.petName.trim() || !form.date) {
      setError("Please fill in your name, phone, your pet's name and a date.");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 7) {
      setError("That phone number looks too short — we need it to confirm your slot.");
      return;
    }
    if (form.date < today) {
      setError("Please pick today or a later date.");
      return;
    }
    if (slots.length === 0) {
      setError("We're closed that day. Please choose another date.");
      return;
    }
    if (!form.time) {
      setError("Please choose a time slot.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: booking.id || null,
          ownerName: form.ownerName.trim(),
          phone: form.phone.trim(),
          petName: form.petName.trim(),
          // Clinic wall-clock time, pinned to UTC — see src/lib/format.ts.
          preferredDate: `${form.date}T${form.time}:00.000Z`,
          notes: form.notes.trim()
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "We couldn't submit that request. Please try again or call us.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Network problem — please try again, or call us instead.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {services.length > 0 && (
        <div className="store-controls">
          <div className="controls-row">
            <div className="search-wrap">
              <IconSearch />
              <input
                className="search-input"
                type="search"
                placeholder="Search vaccination, checkup, surgery…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search services"
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch("")} aria-label="Clear search">
                  <IconX />
                </button>
              )}
            </div>
          </div>
          {categories.length > 1 && (
            <div className="category-pills" role="group" aria-label="Filter by category">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`pill${category === c ? " pill-active" : ""}`}
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {services.length === 0 ? (
        <div className="empty service-empty">
          <h3>Request a clinic appointment</h3>
          <p>Tell us about your pet and choose a preferred time. The clinic will call to confirm your visit.</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => openBooking(generalAppointment)}>Request an appointment</button>
            <a className="btn" href={telHref}><IconPhone /> Call the clinic</a>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <h3>No services matched</h3>
          <p>Try another search term, or clear the filters.</p>
          <button
            className="btn"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((s, i) => (
            <article className="card" key={s.id} style={{ animationDelay: `${Math.min(i, 12) * 0.04}s` }}>
              <div className="card-media">
                {s.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.imageUrl} alt={s.name} loading="lazy" />
                ) : (
                  <div className="placeholder">
                    <IconPaw />
                  </div>
                )}
              </div>
              <div className="body">
                {s.category && <span className="badge">{s.category}</span>}
                <h3>{s.name}</h3>
                {s.description && <p className="desc">{s.description}</p>}
                <div className="card-foot">
                  <span className="price">{formatPrice(s.price)}</span>
                  {s.durationMin && (
                    <span className="price-note">
                      <IconClock /> {s.durationMin} min
                    </span>
                  )}
                </div>
                <button className="btn btn-primary btn-block" onClick={() => openBooking(s)}>
                  Book appointment
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {booking && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`Book ${booking.name}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setBooking(null);
          }}
        >
          <div className="modal-box">
            {success ? (
              <div className="success-panel">
                <div className="tick">
                  <IconCheck />
                </div>
                <h2>Request sent</h2>
                <p className="sub">
                  We have your request for <strong>{booking.name}</strong>. The clinic will call{" "}
                  {form.phone} to confirm the time.
                </p>
                <button className="btn btn-primary btn-block" onClick={() => setBooking(null)}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="modal-head">
                  <div>
                    <h2>Book an appointment</h2>
                    <p className="sub">We&apos;ll confirm by phone — nothing is charged online.</p>
                  </div>
                  <button
                    type="button"
                    className="icon-close"
                    onClick={() => setBooking(null)}
                    aria-label="Close"
                  >
                    <IconX />
                  </button>
                </div>

                <div className="summary-strip">
                  <div>
                    <div className="s-name">{booking.name}</div>
                    <div className="s-meta">
                      {booking.category || "Clinic service"}
                      {booking.durationMin ? ` · ${booking.durationMin} min` : ""}
                    </div>
                  </div>
                  <span className="s-price">{formatPrice(booking.price)}</span>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="ownerName">Your name</label>
                    <input
                      id="ownerName"
                      value={form.ownerName}
                      onChange={(e) => update("ownerName", e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Phone number</label>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="98XXXXXXXX"
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="petName">Pet&apos;s name</label>
                    <input
                      id="petName"
                      value={form.petName}
                      onChange={(e) => update("petName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="date">Preferred date</label>
                    <input
                      id="date"
                      type="date"
                      min={today}
                      max={maxDate}
                      value={form.date}
                      onChange={(e) => {
                        update("date", e.target.value);
                        update("time", "");
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Preferred time</label>
                  {!form.date ? (
                    <p className="hint">Pick a date to see available times.</p>
                  ) : slots.length === 0 ? (
                    <p className="hint">We&apos;re closed on that day — please choose another date.</p>
                  ) : (
                    <div className="slot-grid">
                      {slots.map((s) => (
                        <button
                          type="button"
                          key={s}
                          className={`slot${form.time === s ? " slot-active" : ""}`}
                          onClick={() => update("time", s)}
                          aria-pressed={form.time === s}
                        >
                          {slotLabel(s)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="notes">Notes (optional)</label>
                  <textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    placeholder="Symptoms, breed, age — anything the vet should know"
                  />
                </div>

                {error && <div className="err">{error}</div>}

                <div className="form-actions">
                  <a className="btn" href={telHref}>
                    <IconPhone /> Call instead
                  </a>
                  <button className="btn btn-primary" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner" /> Sending…
                      </>
                    ) : (
                      "Request appointment"
                    )}
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
