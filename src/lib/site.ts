/**
 * Single source of truth for clinic contact details and opening hours.
 * Override any of these with env vars so the same build can be reused.
 */

export const site = {
  name: "SupposeVeterinary",
  tagline: "Caring for your pets like family",
  /** Displayed and used for tel: links. */
  phone: process.env.NEXT_PUBLIC_CLINIC_PHONE || "+977 9808486381",
  /** Digits only — required by wa.me links. */
  whatsapp: process.env.NEXT_PUBLIC_CLINIC_WHATSAPP || "9779808486381",
  email: process.env.NEXT_PUBLIC_CLINIC_EMAIL || "hello@supposeveterinary.com",
  address: process.env.NEXT_PUBLIC_CLINIC_ADDRESS || "Kathmandu, Nepal",
  /** Used for the open/closed indicator so it doesn't depend on the server's clock. */
  timeZone: process.env.NEXT_PUBLIC_CLINIC_TIMEZONE || "Asia/Kathmandu",
  mapUrl:
    process.env.NEXT_PUBLIC_CLINIC_MAP_URL ||
    "https://www.google.com/maps/search/?api=1&query=veterinary+clinic+Kathmandu"
} as const;

/** tel: href with spaces stripped. */
export const telHref = `tel:${site.phone.replace(/[^\d+]/g, "")}`;

export function whatsappHref(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * wa.me link to an arbitrary number — used by the dashboard to message a customer.
 * Bare local numbers get the Nepal country code so wa.me can resolve them.
 */
export function whatsappTo(phone: string, message?: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("9")) digits = `977${digits}`;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** tel: href for an arbitrary number. */
export function telTo(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Opening hours, keyed by JS `Date.getDay()` (0 = Sunday). */
export const openingHours: { day: string; label: string; open: number | null; close: number | null }[] = [
  { day: "Sunday", label: "8:00 AM – 7:00 PM", open: 8, close: 19 },
  { day: "Monday", label: "8:00 AM – 7:00 PM", open: 8, close: 19 },
  { day: "Tuesday", label: "8:00 AM – 7:00 PM", open: 8, close: 19 },
  { day: "Wednesday", label: "8:00 AM – 7:00 PM", open: 8, close: 19 },
  { day: "Thursday", label: "8:00 AM – 7:00 PM", open: 8, close: 19 },
  { day: "Friday", label: "8:00 AM – 7:00 PM", open: 8, close: 19 },
  { day: "Saturday", label: "9:00 AM – 4:00 PM", open: 9, close: 16 }
];

/**
 * Appointment slots offered for a given `YYYY-MM-DD`, in 30-minute steps.
 * Returns an empty list for days the clinic is closed.
 */
export function slotsForDate(dateKey: string): string[] {
  const d = new Date(`${dateKey}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return [];

  const hours = openingHours[d.getUTCDay()];
  if (!hours || hours.open === null || hours.close === null) return [];

  const slots: string[] = [];
  for (let minutes = hours.open * 60; minutes < hours.close * 60; minutes += 30) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return slots;
}

/** `14:30` → `2:30 PM` */
export function slotLabel(slot: string): string {
  const [h, m] = slot.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/**
 * Weekday index (0 = Sunday) and decimal hour in the clinic's own timezone,
 * regardless of where the code runs.
 */
export function clinicClock(now = new Date()): { day: number; hour: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: site.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = Math.max(0, days.indexOf(get("weekday")));
  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));

  return { day, hour: hour + (Number.isFinite(minute) ? minute / 60 : 0) };
}

export function isOpenNow(now = new Date()) {
  const { day, hour } = clinicClock(now);
  const hours = openingHours[day];
  if (!hours || hours.open === null || hours.close === null) return false;
  return hour >= hours.open && hour < hours.close;
}

/** Today's date in the clinic's timezone, as `YYYY-MM-DD`. */
export function clinicDateKey(now = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: site.timeZone }).format(now);
}

/** Today's row in `openingHours`, in clinic time. */
export function todayHours(now = new Date()) {
  return openingHours[clinicClock(now).day];
}
