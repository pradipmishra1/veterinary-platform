import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  if (!body?.name || typeof body.price !== "number") {
    return NextResponse.json({ error: "Name and a numeric price are required." }, { status: 400 });
  }
  if (body.price < 0) {
    return NextResponse.json({ error: "Price cannot be negative." }, { status: 400 });
  }

  try {
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        category: body.category || null,
        price: body.price,
        stock: typeof body.stock === "number" ? body.stock : 0,
        description: body.description || null,
        imageUrl: body.imageUrl || null
      }
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
}