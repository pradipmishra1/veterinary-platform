"use client";

import { useState, useMemo } from "react";

type Product = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  stock: number;
  description: string | null;
  imageUrl: string | null;
};

function formatPrice(n: number) {
  return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function StorePage({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean) as string[]);
    return ["All", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  return (
    <>
      <header className="site">
        <div className="logo">
          <span className="logo-badge">V</span> Veterinary
        </div>
        <nav className="site">
          <a href="/services">Services</a>
        </nav>
      </header>

      <div className="hero">
        <h1>Everything your pet needs</h1>
        <p>Food, health essentials and accessories.</p>
      </div>

      <div className="wrap">
        <div className="store-controls">
          <input
            className="search-input"
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="category-pills">
            {categories.map((c) => (
              <button
                key={c}
                className={`pill ${category === c ? "pill-active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            {products.length === 0 ? "No products yet." : "No products match your search."}
          </div>
        ) : (
          <div className="grid">
            {filtered.map((p) => (
              <div className="card" key={p.id}>
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.name} />
                ) : (
                  <div style={{ height: 150, background: "#eee" }} />
                )}
                <div className="body">
                  {p.category && <span className="badge">{p.category}</span>}
                  <h3>{p.name}</h3>
                  {p.description && <p className="desc">{p.description}</p>}
                  <div className="price">{formatPrice(p.price)}</div>
                  {p.stock <= 0 && <span className="out-of-stock">Out of stock</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}