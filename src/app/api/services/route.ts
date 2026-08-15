import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body?.name || typeof body.price !== "number") {
    return NextResponse.json({ error: "Name and a numeric price are required." }, { status: 400 });
  }
  if (body.price < 0) {
    return NextResponse.json({ error: "Price cannot be negative." }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: {
      name: body.name,
      category: body.category || null,
      price: body.price,
      durationMin: typeof body.durationMin === "number" ? body.durationMin : null,
      description: body.description || null,
      imageUrl: body.imageUrl || null
    }
  });

  return NextResponse.json(service, { status: 201 });
}