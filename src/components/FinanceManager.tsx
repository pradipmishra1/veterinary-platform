"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Entry = {
  id: string;
  type: "income" | "expense";
  description: string;
  category: string | null;
  amount: number;
  date: string;
};

function formatPrice(n: number) {
  return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function FinanceManager({ initialEntries }: { initialEntries: Entry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [modalType, setModalType] = useState<"income" | "expense" | null>(null);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), description: "", category: "", amount: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const income = entries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const expense = entries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0);

  function exportCsv() {
    const header = "Date,Type,Description,Category,Amount\n";
    const rows = entries
      .map((e) => `${e.date},${e.type},"${e.description.replace(/"/g, '""')}","${(e.category || "").replace(/"/g, '""')}",${e.amount}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function openModal(type: "income" | "expense") {
    setForm({ date: new Date().toISOString().slice(0, 10), description: "", category: "", amount: "" });
    setError("");
    setModalType(type);
  }

  async function handleSave() {
    const amount = parseFloat(form.amount);
    if (!form.description.trim()) {
      setError("Please enter a description.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: modalType,
          date: form.date,
          description: form.description.trim(),
          category: form.category.trim(),
          amount
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save entry.");
        return;
      }
      setEntries((prev) => [{ ...data, amount: Number(data.amount), date: data.date.slice(0, 10) }, ...prev]);
      setModalType(null);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/finance/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Failed to delete entry.");
        return;
      }
      setEntries((prev) => prev.filter((e) => e.id !== id));
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="row" style={{ marginBottom: 18 }}>
        <div className="stat">
          <div className="label">Total income</div>
          <div className="value" style={{ color: "var(--green-dark)" }}>{formatPrice(income)}</div>
        </div>
        <div className="stat">
          <div className="label">Total expenses</div>
          <div className="value" style={{ color: "var(--danger)" }}>{formatPrice(expense)}</div>
        </div>
        <div className="stat">
          <div className="label">Net</div>
          <div className="value">{formatPrice(income - expense)}</div>
        </div>
      </div>

      <div className="toolbar">
        <button className="btn" onClick={exportCsv} disabled={entries.length === 0}>Export CSV</button>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn" onClick={() => openModal("expense")}>+ Add expense</button>
          <button className="btn btn-primary" onClick={() => openModal("income")}>+ Add income</button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="empty">No entries yet.</div>
      ) : (
        <table>
          <thead>
            <tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th></th></tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td>{e.date}</td>
                <td>{e.description}</td>
                <td>{e.category || "-"}</td>
                <td className={e.type === "income" ? "pill-in" : "pill-out"}>
                  {e.type === "income" ? "+ " : "- "}{formatPrice(e.amount)}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(e.id)}
                    disabled={deletingId === e.id}
                  >
                    {deletingId === e.id ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalType && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalType(null); }}
        >
          <div style={{ background: "#fff", borderRadius: 14, padding: 26, width: 420, maxWidth: "90vw" }}>
            <h2 style={{ marginTop: 0, fontSize: 18 }}>
              {modalType === "income" ? "Add income" : "Add expense"}
            </h2>
            <div className="field">
              <label>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="field">
              <label>Description</label>
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="e.g. Product sale, Rent, Supplies"
              />
            </div>
            <div className="field">
              <label>Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Sales, Rent, Medicine, Salary"
              />
            </div>
            <div className="field">
              <label>Amount ($)</label>
              <input
                type="number" step="0.01" min="0"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </div>
            {error && <div className="err">{error}</div>}
            <div className="form-actions">
              <button className="btn" onClick={() => setModalType(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}