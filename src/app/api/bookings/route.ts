import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendBookingAlert } from "@/lib/notify";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { service: true }
  });
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body?.serviceId || !body?.ownerName || !body?.phone || !body?.petName || !body?.preferredDate) {
    return NextResponse.json(
      { error: "Owner name, phone, pet name, service, and preferred date are all required." },
      { status: 400 }
    );
  }

  const service = await prisma.service.findUnique({ where: { id: body.serviceId } });
  if (!service) {
    return NextResponse.json({ error: "Selected service does not exist." }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: {
      serviceId: body.serviceId,
      ownerName: body.ownerName.trim(),
      phone: body.phone.trim(),
      petName: body.petName.trim(),
      preferredDate: new Date(body.preferredDate),
      notes: body.notes?.trim() || null
    }
  });

  sendBookingAlert({
    ownerName: booking.ownerName,
    phone: booking.phone,
    petName: booking.petName,
    serviceName: service.name,
    preferredDate: body.preferredDate,
    notes: booking.notes
  }).catch((err) => console.error("Notification error:", err));

  return NextResponse.json(booking, { status: 201 });
}