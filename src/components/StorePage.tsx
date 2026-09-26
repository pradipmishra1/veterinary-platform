"use client";

import { useMemo, useState } from "react";
import { IconFilter, IconSearch, IconX } from "@/components/Icons";
import ProductCard, { type StoreProduct } from "@/components/ProductCard";

type SortKey = "newest" | "price-asc" | "price-desc" | "name";

const sortLabels: Record<SortKey, string> = {
  newest: "Recently added",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name: A–Z"
};

export default function StorePage({ products }: { products: StoreProduct[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories = useMemo(() => {
    const available = new Set(products.map((product) => product.category).filter(Boolean) as string[]);
    return ["All", ...Array.from(available).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = products.filter((product) => {
      if (category !== "All" && product.category !== category) return false;
      if (inStockOnly && product.stock <= 0) return false;
      if (!query) return true;
      return product.name.toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query) ||
        (product.category || "").toLowerCase().includes(query);
    });

    switch (sort) {
      case "price-asc": return [...list].sort((a, b) => a.price - b.price);
      case "price-desc": return [...list].sort((a, b) => b.price - a.price);
      case "name": return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default: return list;
    }
  }, [products, search, category, inStockOnly, sort]);

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setInStockOnly(false);
  }

  if (products.length === 0) {
    return (
      <div className="empty empty-shop">
        <span className="empty-icon"><IconFilter /></span>
        <h3>The shop is being stocked</h3>
        <p>No products are listed yet. Call us and we&apos;ll help you find what your pet needs.</p>
      </div>
    );
  }

  return (
    <>
      <div className="store-toolbar">
        <div className="store-controls">
          <div className="controls-row">
            <div className="search-wrap">
              <IconSearch />
              <input
                className="search-input"
                type="search"
                placeholder="Search products and categories"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search products"
              />
              {search && <button className="search-clear" onClick={() => setSearch("")} aria-label="Clear search"><IconX /></button>}
            </div>
            <label className="sort-label">
              <span>Sort</span>
              <select className="sort-select" value={sort} onChange={(event) => setSort(event.target.value as SortKey)} aria-label="Sort products">
                {(Object.keys(sortLabels) as SortKey[]).map((key) => <option key={key} value={key}>{sortLabels[key]}</option>)}
              </select>
            </label>
          </div>
          <div className="category-row">
            <div className="category-pills" role="group" aria-label="Filter by category">
              {categories.map((item) => (
                <button key={item} className={`pill${category === item ? " pill-active" : ""}`} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>
              ))}
            </div>
            <button className={`stock-filter${inStockOnly ? " stock-filter-active" : ""}`} type="button" onClick={() => setInStockOnly((value) => !value)} aria-pressed={inStockOnly}>
              <span className="stock-filter-check" aria-hidden="true">{inStockOnly ? "✓" : ""}</span>In stock
            </button>
          </div>
        </div>
        <div className="result-count" aria-live="polite"><span>{filtered.length} products</span>{filtered.length !== products.length && <button onClick={clearFilters}>Clear filters</button>}</div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty empty-shop">
          <span className="empty-icon"><IconSearch /></span>
          <h3>No products found</h3>
          <p>Try another search or clear the filters to see the full shop.</p>
          <button className="btn btn-secondary" onClick={clearFilters}>Clear filters</button>
        </div>
      ) : (
        <div className="grid product-grid">
          {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </>
  );
}
