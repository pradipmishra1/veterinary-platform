import { prisma } from "@/lib/db";
import FinanceManager from "@/components/FinanceManager";

export const dynamic = "force-dynamic";

export default async function AdminFinancePage() {
  const entries = await prisma.financeEntry.findMany({ orderBy: { date: "desc" } });

  const serializable = entries.map((e) => ({
    ...e,
    amount: Number(e.amount),
    date: e.date.toISOString().slice(0, 10)
  }));

  return (
    <>
      <h2 className="section">Income & expenses</h2>
      <p className="sub">Track money in and out of the clinic/shop</p>
      <FinanceManager initialEntries={serializable} />
    </>
  );
}