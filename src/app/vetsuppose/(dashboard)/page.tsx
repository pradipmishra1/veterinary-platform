import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import OverviewCharts, { type CategoryData, type MonthData } from "@/components/OverviewCharts";
import { formatPrice, formatTime, initials, relativeDay } from "@/lib/format";
import { clinicDateKey } from "@/lib/site";
import {
  IconBox,
  IconWallet,
  IconTrendDown,
  IconCalendar,
  IconAlert,
  IconPlus
} from "@/components/Icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Overview", robots: { index: false, follow: false } };

const LOW_STOCK_THRESHOLD = 5;

/** Six month buckets ending with the current one, keyed `YYYY-MM`. */
function lastSixMonths(todayKey: string) {
  const [y, m] = todayKey.split("-").map(Number);
  const out: { key: string; label: string }[] = [];
  for (let back = 5; back >= 0; back--) {
    const d = new Date(Date.UTC(y, m - 1 - back, 1));
    out.push({
      key: `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })
    });
  }
  return out;
}

export default async function AdminOverviewPage() {
  const todayKey = clinicDateKey();
  // Dates are clinic wall-clock pinned to UTC, so bounds are built the same way.
  const dayStart = new Date(`${todayKey}T00:00:00.000Z`);
  const dayEnd = new Date(`${todayKey}T23:59:59.999Z`);
  const monthKey = todayKey.slice(0, 7);

  const [productCount, lowStock, entries, todaysBookings, statusCounts, upcomingCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.findMany({
        where: { stock: { lte: LOW_STOCK_THRESHOLD } },
        orderBy: { stock: "asc" },
        select: { id: true, name: true, stock: true }
      }),
      prisma.financeEntry.findMany({ select: { type: true, amount: true, date: true, category: true } }),
      prisma.booking.findMany({
        where: { preferredDate: { gte: dayStart, lte: dayEnd } },
        orderBy: { preferredDate: "asc" },
        include: { service: true }
      }),
      prisma.booking.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.booking.count({ where: { preferredDate: { gt: dayEnd }, status: { in: ["pending", "confirmed"] } } })
    ]);

  const byStatus = Object.fromEntries(statusCounts.map((s) => [s.status, s._count._all]));
  const totalBookings = statusCounts.reduce((sum, s) => sum + s._count._all, 0);
  const pendingBookings = byStatus.pending ?? 0;

  const sum = (rows: typeof entries, type: "income" | "expense", prefix?: string) =>
    rows
      .filter((e) => e.type === type)
      .filter((e) => !prefix || e.date.toISOString().startsWith(prefix))
      .reduce((s, e) => s + Number(e.amount), 0);

  const monthIncome = sum(entries, "income", monthKey);
  const monthExpense = sum(entries, "expense", monthKey);
  const netAll = sum(entries, "income") - sum(entries, "expense");

  const months: MonthData[] = lastSixMonths(todayKey).map(({ key, label }) => ({
    label,
    income: sum(entries, "income", key),
    expense: sum(entries, "expense", key)
  }));

  const categoryTotals = new Map<string, number>();
  for (const e of entries) {
    if (e.type !== "expense") continue;
    const label = e.category || "Uncategorised";
    categoryTotals.set(label, (categoryTotals.get(label) ?? 0) + Number(e.amount));
  }
  const categoryData: CategoryData[] = Array.from(categoryTotals, ([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const outOfStock = lowStock.filter((p) => p.stock <= 0);

  return (
    <>
      {lowStock.length > 0 && (
        <div className="alert-strip">
          <IconAlert />
          <div>
            <strong>
              {outOfStock.length > 0
                ? `${outOfStock.length} product${outOfStock.length === 1 ? "" : "s"} out of stock`
                : `${lowStock.length} product${lowStock.length === 1 ? "" : "s"} running low`}
            </strong>
            {" — "}
            {lowStock
              .slice(0, 3)
              .map((p) => `${p.name} (${p.stock})`)
              .join(", ")}
            {lowStock.length > 3 ? ` +${lowStock.length - 3} more` : ""}
          </div>
          <a href="/vetsuppose/products">Restock</a>
        </div>
      )}

      <div className="premium-row">
        <div className="premium-stat">
          <div className="premium-stat-icon blue">
            <IconBox />
          </div>
          <div className="p-value">{productCount}</div>
          <div className="p-label">
            Products listed{lowStock.length > 0 ? ` · ${lowStock.length} low` : ""}
          </div>
        </div>
        <div className="premium-stat" style={{ animationDelay: "0.05s" }}>
          <div className="premium-stat-icon green">
            <IconWallet />
          </div>
          <div className="p-value">{formatPrice(monthIncome)}</div>
          <div className="p-label">Income this month</div>
        </div>
        <div className="premium-stat" style={{ animationDelay: "0.1s" }}>
          <div className="premium-stat-icon red">
            <IconTrendDown />
          </div>
          <div className="p-value">{formatPrice(monthExpense)}</div>
          <div className="p-label">Expenses this month</div>
        </div>
        <div className="premium-stat" style={{ animationDelay: "0.15s" }}>
          <div className="premium-stat-icon purple">
            <IconCalendar />
          </div>
          <div className="p-value">{todaysBookings.length}</div>
          <div className="p-label">
            Today · {pendingBookings} pending, {upcomingCount} upcoming
          </div>
        </div>
      </div>

      <div className="schedule-card" style={{ marginTop: 16 }}>
        <h3>
          Today&apos;s schedule
          <a href="/vetsuppose/bookings">View all {totalBookings}</a>
        </h3>
        {todaysBookings.length === 0 ? (
          <div className="empty" style={{ padding: "24px 14px" }}>
            <h3>Nothing booked today</h3>
            <p>New requests appear here as soon as they come in.</p>
          </div>
        ) : (
          todaysBookings.map((b, i) => (
            <div className="schedule-row" key={b.id} style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
              <div className="pet-avatar">{initials(b.petName)}</div>
              <div className="info">
                <div className="pet-name">{b.petName}</div>
                <div className="pet-meta">
                  {b.service?.name ?? "General appointment"} · {b.ownerName}
                </div>
              </div>
              <div className="time-col">
                <div className="time-val">{formatTime(b.preferredDate)}</div>
                <span className={`status-chip status-${b.status}`}>{b.status}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <OverviewCharts months={months} categoryData={categoryData} />

      <div className="stat" style={{ marginTop: 14 }}>
        <div className="label">Net position, all time</div>
        <div className="value" style={{ color: netAll < 0 ? "var(--danger)" : "var(--green-dark)" }}>
          {formatPrice(netAll)}
        </div>
        <p className="hint" style={{ margin: "4px 0 0" }}>
          {byStatus.completed ?? 0} appointments completed · {byStatus.cancelled ?? 0} cancelled
          {todaysBookings.length > 0 ? ` · next up ${relativeDay(todaysBookings[0].preferredDate, todayKey)}` : ""}
        </p>
      </div>

      <div className="hero-actions" style={{ marginTop: 20 }}>
        <a href="/vetsuppose/products/new" className="btn btn-primary">
          <IconPlus /> Add product
        </a>
        <a href="/vetsuppose/services/new" className="btn">
          <IconPlus /> Add service
        </a>
        <a href="/vetsuppose/finance" className="btn">
          <IconPlus /> Record income / expense
        </a>
      </div>
    </>
  );
}
