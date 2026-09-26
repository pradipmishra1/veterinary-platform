import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendBookingAlert } from "@/lib/notify";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  ValidationError,
  optionalString,
  requireDate,
  requirePhone,
  requireString
} from "@/lib/validate";
import { clinicDateKey, slotsForDate } from "@/lib/site";

/** Admin-only (enforced in middleware): the dashboard list. */
export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { service: true }
  });
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  // Publicly reachable, so keep a lid on how fast one client can submit.
  const limit = rateLimit(`booking:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes, or call the clinic directly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const serviceId = body.serviceId == null || body.serviceId === ""
      ? null
      : requireString(body.serviceId, "Service", { max: 40 });
    const ownerName = requireString(body.ownerName, "Your name", { max: 120 });
    const phone = requirePhone(body.phone);
    const petName = requireString(body.petName, "Pet name", { max: 80 });
    const preferredDate = requireDate(body.preferredDate, "Preferred date");
    const notes = optionalString(body.notes, "Notes", 1000);

    // `preferredDate` is clinic wall-clock pinned to UTC — see src/lib/format.ts.
    const dateKey = preferredDate.toISOString().slice(0, 10);
    if (dateKey < clinicDateKey()) {
      return NextResponse.json({ error: "Please choose today or a later date." }, { status: 400 });
    }

    const slots = slotsForDate(dateKey);
    if (slots.length === 0) {
      return NextResponse.json(
        { error: "The clinic is closed that day. Please choose another date." },
        { status: 400 }
      );
    }

    const requestedSlot = preferredDate.toISOString().slice(11, 16);
    if (!slots.includes(requestedSlot)) {
      return NextResponse.json(
        { error: "That time is outside our opening hours. Please pick one of the offered slots." },
        { status: 400 }
      );
    }

    const service = serviceId ? await prisma.service.findUnique({ where: { id: serviceId } }) : null;
    if (serviceId && !service) {
      return NextResponse.json({ error: "Selected service does not exist." }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: { serviceId, ownerName, phone, petName, preferredDate, notes }
    });

    // Fire-and-forget: a failed WhatsApp alert must not fail the customer's request.
    sendBookingAlert({
      ownerName: booking.ownerName,
      phone: booking.phone,
      petName: booking.petName,
      serviceName: service?.name ?? "General appointment",
      preferredDate: booking.preferredDate.toISOString(),
      notes: booking.notes
    }).catch((err) => console.error("Notification error:", err));

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Booking error:", err);
    return NextResponse.json({ error: "Could not save that request. Please try again." }, { status: 500 });
  }
}
