import { prisma } from "@/lib/db";
import { IconBox, IconWallet, IconTrendDown, IconCalendar } from "@/components/Icons";

export const dynamic = "force-dynamic";

function formatPrice(value: unknown) {
  const n = Number(value);
  return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase();
}
function formatTime(d: Date) {
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export default async function AdminOverviewPage() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [productCount, entries, todaysBookings, pendingBookings, totalBookings] = await Promise.all([
    prisma.product.count(),
    prisma.financeEntry.findMany(),
    prisma.booking.findMany({
      where: { preferredDate: { gte: todayStart, lte: todayEnd } },
      orderBy: { preferredDate: "asc" },
      include: { service: true }
    }),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.booking.count()
  ]);

  const income = entries.filter((e) => e.type === "income").reduce((s, e) => s + Number(e.amount), 0);
  const expense = entries.filter((e) => e.type === "expense").reduce((s, e) => s + Number(e.amount), 0);

  return (
    <>
      <div className="premium-row">
        <div className="premium-stat">
          <div className="premium-stat-icon blue"><IconBox /></div>
          <div className="p-value">{productCount}</div>
          <div className="p-label">Products in Stock</div>
        </div>
        <div className="premium-stat" style={{ animationDelay: "0.05s" }}>
          <div className="premium-stat-icon green"><IconWallet /></div>
          <div className="p-value">{formatPrice(income)}</div>
          <div className="p-label">Total Income</div>
        </div>
        <div className="premium-stat" style={{ animationDelay: "0.1s" }}>
          <div className="premium-stat-icon red"><IconTrendDown /></div>
          <div className="p-value">{formatPrice(expense)}</div>
          <div className="p-label">Total Expenses</div>
        </div>
        <div className="premium-stat" style={{ animationDelay: "0.15s" }}>
          <div className="premium-stat-icon purple"><IconCalendar /></div>
          <div className="p-value">{totalBookings}</div>
          <div className="p-label">{pendingBookings} Pending</div>
        </div>
      </div>

      <div className="schedule-card" style={{ marginTop: 16 }}>
        <h3>Today's Schedule</h3>
        {todaysBookings.length === 0 ? (
          <div className="empty" style={{ padding: "24px 14px" }}>No appointments today.</div>
        ) : (
          todaysBookings.map((b, i) => (
            <div className="schedule-row" key={b.id} style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
              <div className="pet-avatar">{initials(b.petName)}</div>
              <div className="info">
                <div className="pet-name">{b.petName}</div>
                <div className="pet-meta">{b.service.name}</div>
              </div>
              <div className="time-col">
                <div className="time-val">{formatTime(b.preferredDate)}</div>
                <span className="upcoming-pill" style={{ textTransform: "capitalize" }}>{b.status}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
        <a href="/vetsuppose/products/new" className="btn btn-primary">+ Add product</a>
        <a href="/vetsuppose/finance" className="btn">+ Add income / expense</a>
      </div>
    </>
  );
}