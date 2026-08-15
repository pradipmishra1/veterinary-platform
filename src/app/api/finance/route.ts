import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const entries = await prisma.financeEntry.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body?.description || typeof body.amount !== "number" || !body?.date) {
    return NextResponse.json(
      { error: "Description, date, and a numeric amount are required." },
      { status: 400 }
    );
  }
  if (body.amount <= 0) {
    return NextResponse.json({ error: "Amount must be greater than zero." }, { status: 400 });
  }
  if (body.type !== "income" && body.type !== "expense") {
    return NextResponse.json({ error: "Type must be 'income' or 'expense'." }, { status: 400 });
  }

  const entry = await prisma.financeEntry.create({
    data: {
      type: body.type,
      description: body.description,
      category: body.category || null,
      amount: body.amount,
      date: new Date(body.date)
    }
  });

  return NextResponse.json(entry, { status: 201 });
}