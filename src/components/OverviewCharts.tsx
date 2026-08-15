"use client";

type MonthData = { label: string; income: number; expense: number };
type CategoryData = { label: string; value: number };

function formatPrice(n: number) {
  return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export default function OverviewCharts({ months, categoryData }: { months: MonthData[]; categoryData: CategoryData[] }) {
  const maxMonthly = Math.max(1, ...months.flatMap((m) => [m.income, m.expense]));
  const maxCategory = Math.max(1, ...categoryData.map((c) => c.value));
  const colors = ["#1d7a5f", "#2f9d78", "#59b592", "#8fceb2", "#c0e4d3", "#e2f2ea"];

  return (
    <div className="row" style={{ marginTop: 24, alignItems: "stretch" }}>
      {/* Bar chart: income vs expense by month */}
      <div className="stat" style={{ flex: 2, minWidth: 320 }}>
        <div className="label" style={{ marginBottom: 14 }}>Income vs expenses (last 6 months)</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 160 }}>
          {months.map((m) => (
            <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 130, width: "100%", justifyContent: "center" }}>
                <div
                  title={`Income: ${formatPrice(m.income)}`}
                  style={{
                    width: 14,
                    height: `${(m.income / maxMonthly) * 100}%`,
                    background: "linear-gradient(180deg, #1d7a5f, #145a45)",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.4s ease",
                    minHeight: m.income > 0 ? 3 : 0
                  }}
                />
                <div
                  title={`Expense: ${formatPrice(m.expense)}`}
                  style={{
                    width: 14,
                    height: `${(m.expense / maxMonthly) * 100}%`,
                    background: "linear-gradient(180deg, #e0776b, #c0392b)",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.4s ease",
                    minHeight: m.expense > 0 ? 3 : 0
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{m.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 12, color: "var(--muted)" }}>
          <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#1d7a5f", borderRadius: 2, marginRight: 5 }} />Income</span>
          <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#c0392b", borderRadius: 2, marginRight: 5 }} />Expense</span>
        </div>
      </div>

      {/* Expense by category */}
      <div className="stat" style={{ flex: 1, minWidth: 240 }}>
        <div className="label" style={{ marginBottom: 14 }}>Expenses by category</div>
        {categoryData.length === 0 ? (
          <div className="sub" style={{ margin: 0 }}>No expense data yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {categoryData.map((c, i) => (
              <div key={c.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: "var(--text)", fontWeight: 500 }}>{c.label}</span>
                  <span style={{ color: "var(--muted)" }}>{formatPrice(c.value)}</span>
                </div>
                <div style={{ background: "#eef0ee", borderRadius: 6, height: 8, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${(c.value / maxCategory) * 100}%`,
                      height: "100%",
                      background: colors[i % colors.length],
                      borderRadius: 6,
                      transition: "width 0.5s ease"
                    }}
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