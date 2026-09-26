"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";
import { IconArrowUpRight, IconCart, IconCheck, IconPaw } from "@/components/Icons";

export type StoreProduct = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  stock: number;
  description: string | null;
  imageUrl: string | null;
};

export default function ProductCard({ product }: { product: StoreProduct }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= 5;

  function addToOrder() {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="card product-card">
      <div className="card-media">
        <a className="product-image-link" href={`/products/${product.id}`} aria-label={`View ${product.name}`}>
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} loading="lazy" />
          ) : (
            <div className="placeholder"><IconPaw /></div>
          )}
        </a>
        <div className="corner">
          {soldOut && <span className="out-of-stock">Out of stock</span>}
          {lowStock && <span className="badge badge-warn">Only {product.stock} left</span>}
        </div>
      </div>
      <div className="body">
        {product.category && <span className="badge product-category">{product.category}</span>}
        <a className="product-title-link" href={`/products/${product.id}`}>
          <h3>{product.name}<IconArrowUpRight /></h3>
        </a>
        {product.description && <p className="desc">{product.description}</p>}
        <div className="card-foot"><span className="price">{formatPrice(product.price)}</span></div>
        <button
          className={`btn btn-block product-add${added ? " is-added" : " btn-primary"}`}
          onClick={addToOrder}
          disabled={soldOut}
          aria-live="polite"
        >
          {soldOut ? "Currently unavailable" : added ? <><IconCheck /> Added to your order</> : <><IconCart /> Add to order</>}
        </button>
      </div>
    </article>
  );
}
