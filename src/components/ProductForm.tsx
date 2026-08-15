"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductFormValues = {
  id?: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  imageUrl: string;
};

const emptyValues: ProductFormValues = {
  name: "",
  category: "",
  price: "",
  stock: "0",
  description: "",
  imageUrl: ""
};

export default function ProductForm({ initialValues }: { initialValues?: ProductFormValues }) {
  const router = useRouter();
  const isEdit = Boolean(initialValues?.id);
  const [values, setValues] = useState<ProductFormValues>(initialValues || emptyValues);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Image upload failed.");
        return;
      }
      update("imageUrl", data.url);
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const price = parseFloat(values.price);
    if (!values.name.trim()) {
      setError("Please enter a product name.");
      return;
    }
    if (isNaN(price) || price < 0) {
      setError("Please enter a valid price.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: values.name.trim(),
        category: values.category.trim(),
        price,
        stock: parseInt(values.stock) || 0,
        description: values.description.trim(),
        imageUrl: values.imageUrl
      };

      const res = await fetch(isEdit ? `/api/products/${values.id}` : "/api/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save product.");
        return;
      }

      router.push("/vetsuppose/products");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="field">
        <label>Product image</label>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageChange} />
        {uploading && <p className="sub" style={{ margin: "6px 0 0" }}>Uploading…</p>}
        {values.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={values.imageUrl}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: 140, borderRadius: 8, marginTop: 8 }}
          />
        )}
      </div>

      <div className="field">
        <label>Name</label>
        <input value={values.name} onChange={(e) => update("name", e.target.value)} required />
      </div>

      <div className="field">
        <label>Category</label>
        <input
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
          placeholder="e.g. Food, Health, Accessories"
        />
      </div>

      <div className="row">
        <div className="field" style={{ flex: 1 }}>
          <label>Price ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            required
          />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label>Stock</label>
          <input
            type="number"
            min="0"
            value={values.stock}
            onChange={(e) => update("stock", e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label>Description</label>
        <textarea
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Shown on the shop page"
        />
      </div>

      {error && <div className="err">{error}</div>}

      <div className="form-actions">
        <a className="btn" href="/vetsuppose/products">
          Cancel
        </a>
        <button className="btn btn-primary" disabled={saving || uploading}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Add product"}
        </button>
      </div>
    </form>
  );
}