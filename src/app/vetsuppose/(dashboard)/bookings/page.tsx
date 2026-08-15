import { prisma } from "@/lib/db";
import BookingsTable from "@/components/BookingsTable";
import BookingsCalendarWrapper from "@/components/BookingsCalendarWrapper";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { service: true }
  });

  const serializable = bookings.map((b) => ({
    ...b,
    preferredDate: b.preferredDate.toISOString().slice(0, 10),
    service: { name: b.service.name, price: Number(b.service.price) }
  }));

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <>
      <h2 className="section">Appointment requests</h2>
      <p className="sub">{pendingCount} pending, {bookings.length} total</p>
      <BookingsCalendarWrapper bookings={serializable} />
    </>
  );
}