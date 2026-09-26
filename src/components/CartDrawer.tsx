"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";
import { site, whatsappHref, telHref } from "@/lib/site";
import { IconCart, IconX, IconWhatsApp, IconPhone, IconTrash } from "@/components/Icons";

/** Human-readable order summary sent to the clinic's WhatsApp. */
function buildOrderMessage(items: { name: string; qty: number; price: number }[], total: number) {
  const lines = items.map((i) => `• ${i.name} × ${i.qty} — ${formatPrice(i.price * i.qty)}`);
  return [
    `Hello ${site.name}, I'd like to order:`,
    "",
    ...lines,
    "",
    `Total: ${formatPrice(total)}`,
    "",
    "Please confirm availability and delivery."
  ].join("\n");
}

export default function CartDrawer() {
  const { items, total, count, isOpen, close, setQty, remove, clear } = useCart();
  const panelRef = useRef<HTMLElement>(null);

  // Close on Escape and prevent the page behind the drawer from scrolling.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      previouslyFocused?.focus();
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <>
      <button className="cart-backdrop" onClick={close} aria-label="Close your order" tabIndex={-1} />
      <aside className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabIndex={-1} ref={panelRef}>
        <div className="cart-head">
          <div><span className="eyebrow">YOUR SHOPPING BAG</span><h2 id="cart-title">Your order <span className="badge badge-muted" aria-label={`${count} items`}>{count}</span></h2></div>
          <button className="icon-close" onClick={close} aria-label="Close cart">
            <IconX />
          </button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="empty" style={{ border: "none", background: "transparent" }}>
                <h3>Your order is empty</h3>
                <p>Browse the shop and add what your pet needs. We&apos;ll confirm everything with you.</p>
                <a className="btn btn-primary" href="/" onClick={close}>Explore the shop</a>
            </div>
          ) : (
            items.map((i) => (
              <div className="cart-item" key={i.id}>
                {i.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="thumb-lg" src={i.imageUrl} alt="" />
                ) : (
                  <div className="thumb-lg" />
                )}
                <div className="ci-info">
                  <div className="ci-name">{i.name}</div>
                  <div className="ci-price">
                    {formatPrice(i.price)} each · <strong>{formatPrice(i.price * i.qty)}</strong>
                  </div>
                  <div className="qty-row">
                    <button className="qty-btn" onClick={() => setQty(i.id, i.qty - 1)} aria-label={`Reduce ${i.name}`}>
                      −
                    </button>
                    <span className="qty-val">{i.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => setQty(i.id, i.qty + 1)}
                      disabled={i.stock > 0 && i.qty >= i.stock}
                      aria-label={`Add another ${i.name}`}
                    >
                      +
                    </button>
                    <button
                      className="qty-btn"
                      onClick={() => remove(i.id)}
                      aria-label={`Remove ${i.name}`}
                      style={{ marginLeft: 6 }}
                    >
                      <IconTrash />
                    </button>
                  </div>
                  {i.stock > 0 && i.qty >= i.stock && (
                    <div className="hint" style={{ marginTop: 4 }}>Only {i.stock} in stock</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-foot">
            <div className="cart-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <p className="hint" style={{ margin: 0 }}>
              Orders are confirmed over WhatsApp or phone — no online payment needed.
            </p>
            <a
              className="btn btn-primary btn-block"
              href={whatsappHref(buildOrderMessage(items, total))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconWhatsApp /> Send order on WhatsApp
            </a>
            <div style={{ display: "flex", gap: 8 }}>
              <a className="btn" style={{ flex: 1 }} href={telHref}>
                <IconPhone /> Call clinic
              </a>
              <button className="btn btn-ghost" onClick={clear} aria-label="Clear your order">
                Clear
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export function CartButton() {
  const { count, open } = useCart();
  return (
    <button className="cart-btn" onClick={open} aria-label={`Open cart, ${count} item(s)`}>
      <IconCart />
      <span className="cart-label">Cart</span>
      {count > 0 && <span className="cart-count">{count}</span>}
    </button>
  );
}
