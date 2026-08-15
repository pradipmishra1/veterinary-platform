import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body?.name || typeof body.price !== "number") {
    return NextResponse.json({ error: "Name and a numeric price are required." }, { status: 400 });
  }
  if (body.price < 0) {
    return NextResponse.json({ error: "Price cannot be negative." }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name: body.name,
      category: body.category || null,
      price: body.price,
      stock: typeof body.stock === "number" ? body.stock : 0,
      description: body.description || null,
      imageUrl: body.imageUrl || null
    }
  });

  return NextResponse.json(product, { status: 201 });
}