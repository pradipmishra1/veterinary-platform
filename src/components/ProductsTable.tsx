"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
};

function formatPrice(n: number) {
  return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ProductsTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete product.");
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  if (products.length === 0) {
    return <div className="empty">No products yet. Click "Add product" to create one.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td>
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="thumb" src={p.imageUrl} alt={p.name} />
              ) : (
                <div className="thumb" />
              )}
            </td>
            <td>{p.name}</td>
            <td>{p.category || "-"}</td>
            <td>{formatPrice(p.price)}</td>
            <td>{p.stock}</td>
            <td style={{ display: "flex", gap: 6 }}>
              <a className="btn btn-sm" href={`/vetsuppose/products/${p.id}/edit`}>
                Edit
              </a>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(p.id)}
                disabled={deletingId === p.id}
              >
                {deletingId === p.id ? "Deleting…" : "Delete"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}