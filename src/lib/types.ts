/**
 * Shapes shared between the dashboard's server pages and its client components.
 * Prisma's own types can't cross the boundary (Decimal isn't serializable), so the
 * server pages map into these.
 */

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export const bookingStatuses: readonly BookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled"
];

export type AdminBooking = {
  id: string;
  ownerName: string;
  phone: string;
  petName: string;
  /** Full ISO string — clinic wall-clock pinned to UTC. */
  preferredDate: string;
  notes: string | null;
  status: BookingStatus;
  createdAt: string;
  service: { name: string; price: number } | null;
};
