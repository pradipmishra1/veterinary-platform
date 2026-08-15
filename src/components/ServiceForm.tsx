"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ServiceFormValues = {
  id?: string;
  name: string;
  category: string;
  price: string;
  durationMin: string;
  description: string;
  imageUrl: string;
};

const emptyValues: ServiceFormValues = {
  name: "",
  category: "",
  price: "",
  durationMin: "",
  description: "",
  imageUrl: ""
};

export default function ServiceForm({ initialValues }: { initialValues?: ServiceFormValues }) {
  const router = useRouter();
  const isEdit = Boolean(initialValues?.id);
  const [values, setValues] = useState<ServiceFormValues>(initialValues || emptyValues);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof ServiceFormValues>(key: K, val: ServiceFormValues[K]) {
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
      setError("Please enter a service name.");
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
        durationMin: values.durationMin ? parseInt(values.durationMin) : null,
        description: values.description.trim(),
        imageUrl: values.imageUrl
      };

      const res = await fetch(isEdit ? `/api/services/${values.id}` : "/api/services", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save service.");
        return;
      }

      router.push("/vetsuppose/services");
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
        <label>Image (optional)</label>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageChange} />
        {uploading && <p className="sub" style={{ margin: "6px 0 0" }}>Uploading…</p>}
        {values.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={values.imageUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: 140, borderRadius: 8, marginTop: 8 }} />
        )}
      </div>

      <div className="field">
        <label>Service name</label>
        <input value={values.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Rabies Vaccination" required />
      </div>

      <div className="field">
        <label>Category</label>
        <input value={values.category} onChange={(e) => update("category", e.target.value)} placeholder="e.g. Injections, Checkups, Grooming" />
      </div>

      <div className="row">
        <div className="field" style={{ flex: 1 }}>
          <label>Price ($)</label>
          <input type="number" step="0.01" min="0" value={values.price} onChange={(e) => update("price", e.target.value)} required />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label>Duration (minutes, optional)</label>
          <input type="number" min="0" value={values.durationMin} onChange={(e) => update("durationMin", e.target.value)} placeholder="e.g. 20" />
        </div>
      </div>

      <div className="field">
        <label>Description</label>
        <textarea value={values.description} onChange={(e) => update("description", e.target.value)} placeholder="Shown to pet owners" />
      </div>

      {error && <div className="err">{error}</div>}

      <div className="form-actions">
        <a className="btn" href="/vetsuppose/services">Cancel</a>
        <button className="btn btn-primary" disabled={saving || uploading}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Add service"}
        </button>
      </div>
    </form>
  );
}