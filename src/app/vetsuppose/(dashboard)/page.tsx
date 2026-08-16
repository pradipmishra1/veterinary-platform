import { prisma } from "@/lib/db";
import OverviewCharts from "@/components/OverviewCharts";

export const dynamic = "force-dynamic";

const LOW_STOCK_THRESHOLD = 5;

function formatPrice(value: unknown) {
  const n = Number(value);
  return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function AdminOverviewPage() {
  const [
    productCount,
    serviceCount,
    entries,
    lowStockProducts,
    pendingBookings,
    recentBookings,
    totalBookings
  ] = await Promise.all([
    prisma.product.count(),
    prisma.service.count(),
    prisma.financeEntry.findMany(),
    prisma.product.findMany({ where: { stock: { lte: LOW_STOCK_THRESHOLD } }, orderBy: { stock: "asc" } }),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { service: true } }),
    prisma.booking.count()
  ]);

  const income = entries.filter((e) => e.type === "income").reduce((s, e) => s + Number(e.amount), 0);
  const expense = entries.filter((e) => e.type === "expense").reduce((s, e) => s + Number(e.amount), 0);

  // Last 6 months income/expense breakdown
  const now = new Date();
  const months: { label: string; income: number; expense: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString(undefined, { month: "short" });
    const monthEntries = entries.filter((e) => {
      const ed = new Date(e.date);
      return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth();
    });
    months.push({
      label,
      income: monthEntries.filter((e) => e.type === "income").reduce((s, e) => s + Number(e.amount), 0),
      expense: monthEntries.filter((e) => e.type === "expense").reduce((s, e) => s + Number(e.amount), 0)
    });
  }

  // Expense by category
  const categoryTotals = new Map<string, number>();
  entries.filter((e) => e.type === "expense").forEach((e) => {
    const cat = e.category || "Other";
    categoryTotals.set(cat, (categoryTotals.get(cat) || 0) + Number(e.amount));
  });
  const categoryData = Array.from(categoryTotals.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const serializableRecentBookings = recentBookings.map((b) => ({
    id: b.id,
    ownerName: b.ownerName,
    petName: b.petName,
    serviceName: b.service.name,
    status: b.status,
    date: b.preferredDate.toISOString().slice(0, 10)
  }));

  return (
    <>
      <h2 className="section">Overview</h2>
      <p className="sub">A full snapshot of your clinic</p>

      <div className="row">
        <div className="stat">
          <div className="stat-icon blue">📦</div>
          <div className="label">Products listed</div>
          <div className="value">{productCount}</div>
        </div>
        <div className="stat">
          <div className="stat-icon green">💰</div>
          <div className="label">Total income</div>
          <div className="value" style={{ color: "var(--green-dark)" }}>{formatPrice(income)}</div>
        </div>
        <div className="stat">
          <div className="stat-icon red">📉</div>
          <div className="label">Total expenses</div>
          <div className="value" style={{ color: "var(--danger)" }}>{formatPrice(expense)}</div>
        </div>
        <div className="stat">
          <div className="stat-icon purple">📅</div>
          <div className="label">Pending appointments</div>
          <div className="value">{pendingBookings}</div>
        </div>
        <div className="stat">
          <div className="stat-icon orange">🩺</div>
          <div className="label">Services listed</div>
          <div className="value">{serviceCount}</div>
        </div>
        <div className="stat">
          <div className="stat-icon green">📊</div>
          <div className="label">Net</div>
          <div className="value">{formatPrice(income - expense)}</div>
        </div>
        <div className="stat">
          <div className="stat-icon purple">✅</div>
          <div className="label">Total appointments</div>
          <div className="value">{totalBookings}</div>
        </div>
      </div>

      <OverviewCharts months={months} categoryData={categoryData} />

      <div className="row" style={{ marginTop: 24, alignItems: "flex-start" }}>
        {lowStockProducts.length > 0 && (
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 className="section" style={{ color: "var(--danger)", fontSize: 17 }}>⚠ Low stock</h2>
            <p className="sub">{lowStockProducts.length} product(s) at or below {LOW_STOCK_THRESHOLD} units</p>
            <table>
              <thead><tr><th>Product</th><th>Stock</th><th></th></tr></thead>
              <tbody>
                {lowStockProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td className="pill-out">{p.stock} left</td>
                    <td><a className="btn btn-sm" href={`/vetsuppose/products/${p.id}/edit`}>Restock</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ flex: 1, minWidth: 280 }}>
          <h2 className="section" style={{ fontSize: 17 }}>Recent appointments</h2>
          <p className="sub">Latest 5 requests</p>
          {serializableRecentBookings.length === 0 ? (
            <div className="empty">No appointments yet.</div>
          ) : (
            <table>
              <thead><tr><th>Date</th><th>Pet</th><th>Service</th><th>Status</th></tr></thead>
              <tbody>
                {serializableRecentBookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.date}</td>
                    <td>{b.petName}</td>
                    <td>{b.serviceName}</td>
                    <td>
                      <span className={b.status === "pending" ? "pill-out" : "pill-in"} style={{ textTransform: "capitalize" }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
        <a href="/vetsuppose/products/new" className="btn btn-primary">+ Add product</a>
        <a href="/vetsuppose/services/new" className="btn">+ Add service</a>
        <a href="/vetsuppose/finance" className="btn">+ Add income / expense</a>
        <a href="/vetsuppose/clients" className="btn">View clients</a>
        <a href="/vetsuppose/bookings" className="btn">View all appointments</a>
      </div>
    </>
  );
}