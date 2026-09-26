"use client";

import { formatPrice } from "@/lib/format";

export type MonthData = { label: string; income: number; expense: number };
export type CategoryData = { label: string; value: number };

/**
 * Deliberately dependency-free: two small CSS-only charts beat pulling a charting
 * library into the bundle for what amounts to eight bars and six progress rows.
 */
export default function OverviewCharts({
  months,
  categoryData
}: {
  months: MonthData[];
  categoryData: CategoryData[];
}) {
  const maxMonthly = Math.max(1, ...months.flatMap((m) => [m.income, m.expense]));
  const maxCategory = Math.max(1, ...categoryData.map((c) => c.value));
  const hasMonthly = months.some((m) => m.income > 0 || m.expense > 0);

  return (
    <div className="chart-row">
      <div className="chart-card wide">
        <div className="chart-title">Income vs expenses</div>
        <p className="chart-sub">Last 6 months</p>

        {!hasMonthly ? (
          <p className="hint">No finance entries recorded yet.</p>
        ) : (
          <>
            <div className="bar-chart">
              {months.map((m) => (
                <div className="bar-col" key={m.label}>
                  <div className="bar-pair">
                    <span
                      className="bar bar-income"
                      style={{ height: `${(m.income / maxMonthly) * 100}%` }}
                      title={`${m.label} income: ${formatPrice(m.income)}`}
                    />
                    <span
                      className="bar bar-expense"
                      style={{ height: `${(m.expense / maxMonthly) * 100}%` }}
                      title={`${m.label} expenses: ${formatPrice(m.expense)}`}
                    />
                  </div>
                  <span className="bar-label">{m.label}</span>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <span>
                <i className="swatch income" /> Income
              </span>
              <span>
                <i className="swatch expense" /> Expenses
              </span>
            </div>
          </>
        )}
      </div>

      <div className="chart-card">
        <div className="chart-title">Expenses by category</div>
        <p className="chart-sub">Where the money went</p>

        {categoryData.length === 0 ? (
          <p className="hint">No expense data yet.</p>
        ) : (
          <div className="breakdown">
            {categoryData.map((c, i) => (
              <div className="bd-row" key={c.label}>
                <div className="bd-head">
                  <span>{c.label}</span>
                  <strong>{formatPrice(c.value)}</strong>
                </div>
                <div className="bd-track">
                  <div
                    className={`bd-fill tone-${i % 6}`}
                    style={{ width: `${Math.max(2, (c.value / maxCategory) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
