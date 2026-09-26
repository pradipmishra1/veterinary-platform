/**
 * Shared formatting helpers. Prices are Nepalese rupees; keeping the currency
 * in one place means changing it later is a single edit.
 */

export const CURRENCY_SYMBOL = "Rs.";

/** `Rs. 1,250` — no decimals, since rupee prices are whole numbers in practice. */
export function formatPrice(value: unknown): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return `${CURRENCY_SYMBOL} 0`;
  return `${CURRENCY_SYMBOL} ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

/** `Rs. 1,250.50` — for finance entries, where paisa can matter. */
export function formatAmount(value: unknown): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return `${CURRENCY_SYMBOL} 0.00`;
  return `${CURRENCY_SYMBOL} ${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Dates in this app are wall-clock values: `preferredDate` and finance dates are
 * stored as the clinic's local date/time pinned to UTC. Formatting them in UTC
 * therefore gives the same answer on the server, on the client, and in any
 * visitor's timezone — no drift, no hydration mismatch.
 */
const UTC = "UTC" as const;

function toDate(value: Date | string): Date | null {
  const d = typeof value === "string" ? new Date(value) : value;
  return Number.isNaN(d.getTime()) ? null : d;
}

/** `12 Aug 2026` */
export function formatDate(value: Date | string): string {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: UTC });
}

/** `Wed, 12 Aug` */
export function formatDayShort(value: Date | string): string {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: UTC });
}

/** `2:30 PM`, or `—` when no time was chosen (stored as midnight). */
export function formatTime(value: Date | string): string {
  const d = toDate(value);
  if (!d) return "—";
  if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0) return "—";
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: UTC });
}

/** `12 Aug 2026, 2:30 PM` */
export function formatDateTime(value: Date | string): string {
  const d = toDate(value);
  if (!d) return "—";
  const time = formatTime(d);
  return time === "—" ? formatDate(d) : `${formatDate(d)}, ${time}`;
}

/** `YYYY-MM-DD` for a stored wall-clock date. */
export function toDateKey(value: Date | string): string {
  const d = toDate(value);
  return d ? d.toISOString().slice(0, 10) : "";
}

/** "today", "tomorrow", "in 3 days", "2 days ago" — relative to the clinic's date. */
export function relativeDay(value: Date | string, todayKey?: string): string {
  const key = toDateKey(value);
  if (!key) return "";
  const today = todayKey ?? new Date().toISOString().slice(0, 10);
  const days = Math.round((Date.parse(key) - Date.parse(today)) / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  return days > 0 ? `in ${days} days` : `${Math.abs(days)} days ago`;
}

/** Two-letter initials for avatar bubbles. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Local `YYYY-MM-DD` — avoids the UTC shift you get from `toISOString()`. */
export function toDateInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
