"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";
import { site, telHref, whatsappHref } from "@/lib/site";
import { IconCart, IconCheck, IconPhone, IconWhatsApp } from "@/components/Icons";
import type { StoreProduct } from "@/components/ProductCard";

export default function ProductPurchasePanel({ product }: { product: StoreProduct }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const available = product.stock > 0;
  const message = `Hello ${site.name}, I have a question about ${product.name}. Is it currently available?`;

  function addToOrder() {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock
    }, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="purchase-panel">
      {product.category && <span className="badge product-category">{product.category}</span>}
      <h1>{product.name}</h1>
      {product.description && <p className="product-description">{product.description}</p>}
      <div className="product-price-row"><strong>{formatPrice(product.price)}</strong><span className={available ? "availability-in" : "availability-out"}><i />{available ? `${product.stock} in stock` : "Out of stock"}</span></div>
      <p className="price-note">Orders are confirmed with the clinic. No online payment needed.</p>
      {available && (
        <div className="purchase-quantity">
          <span>Quantity</span>
          <div className="qty-control">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1} aria-label="Reduce quantity">−</button>
            <output aria-live="polite">{quantity}</output>
            <button type="button" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} disabled={quantity >= product.stock} aria-label="Increase quantity">+</button>
          </div>
        </div>
      )}
      <button className={`btn btn-primary btn-block purchase-add${added ? " is-added" : ""}`} onClick={addToOrder} disabled={!available}>
        {added ? <><IconCheck /> Added to your order</> : <><IconCart /> {available ? "Add to order" : "Currently unavailable"}</>}
      </button>
      <a className="btn btn-whatsapp-outline btn-block" href={whatsappHref(message)} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> Ask us about this product</a>
      <div className="purchase-reassurance"><span><IconPhone /> Questions? <a href={telHref}>{site.phone}</a></span><small>For product or dosage guidance, check with a veterinarian.</small></div>
    </div>
  );
}
