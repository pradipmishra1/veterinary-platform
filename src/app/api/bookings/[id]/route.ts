import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
  if (!body?.status || !validStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: { status: body.status }
    });
    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.booking.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
}