/**
 * Small request-validation helpers for the API routes. Deliberately dependency-free
 * so the route handlers stay readable and the bundle stays small.
 */

export class ValidationError extends Error {}

export function requireString(value: unknown, field: string, opts: { max?: number; min?: number } = {}) {
  if (typeof value !== "string") throw new ValidationError(`${field} is required.`);
  const trimmed = value.trim();
  const min = opts.min ?? 1;
  if (trimmed.length < min) throw new ValidationError(`${field} is required.`);
  if (opts.max && trimmed.length > opts.max) {
    throw new ValidationError(`${field} must be under ${opts.max} characters.`);
  }
  return trimmed;
}

export function optionalString(value: unknown, field: string, max = 1000) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") throw new ValidationError(`${field} must be text.`);
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > max) throw new ValidationError(`${field} must be under ${max} characters.`);
  return trimmed;
}

/** Accepts numbers and numeric strings, so form payloads don't need pre-coercion. */
export function requireNumber(value: unknown, field: string, opts: { min?: number; max?: number } = {}) {
  const n = typeof value === "string" ? Number(value.trim()) : value;
  if (typeof n !== "number" || !Number.isFinite(n)) {
    throw new ValidationError(`${field} must be a number.`);
  }
  if (opts.min !== undefined && n < opts.min) {
    throw new ValidationError(`${field} must be at least ${opts.min}.`);
  }
  if (opts.max !== undefined && n > opts.max) {
    throw new ValidationError(`${field} must be at most ${opts.max}.`);
  }
  return n;
}

export function optionalInt(value: unknown, field: string, opts: { min?: number; max?: number } = {}) {
  if (value === undefined || value === null || value === "") return null;
  return Math.round(requireNumber(value, field, opts));
}

export function requireDate(value: unknown, field: string) {
  if (typeof value !== "string" && !(value instanceof Date)) {
    throw new ValidationError(`${field} is required.`);
  }
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) throw new ValidationError(`${field} is not a valid date.`);
  return d;
}

export function requireEnum<T extends readonly string[]>(value: unknown, field: string, allowed: T): T[number] {
  if (typeof value !== "string" || !allowed.includes(value)) {
    throw new ValidationError(`${field} must be one of: ${allowed.join(", ")}.`);
  }
  return value as T[number];
}

/** Nepali mobile numbers are 10 digits; allow an optional +977 country prefix. */
export function requirePhone(value: unknown, field = "Phone number") {
  const raw = requireString(value, field, { max: 24 });
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 7 || digits.length > 15) {
    throw new ValidationError("Please enter a valid phone number.");
  }
  return raw;
}

/** Images are stored as absolute URLs from the blob store; reject anything else. */
export function optionalImageUrl(value: unknown, field = "Image URL") {
  const url = optionalString(value, field, 2048);
  if (!url) return null;
  if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) {
    throw new ValidationError(`${field} must be a valid URL.`);
  }
  return url;
}
