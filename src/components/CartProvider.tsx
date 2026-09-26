"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  /** Stock at the time the item was added — used to cap the quantity stepper. */
  stock: number;
  qty: number;
};

type CartApi = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const STORAGE_KEY = "vet_cart_v1";
const CartContext = createContext<CartApi | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

function readStored(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is CartItem =>
        i && typeof i.id === "string" && typeof i.price === "number" && typeof i.qty === "number"
    );
  } catch {
    return [];
  }
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Hydrate after mount so server and client markup match.
  useEffect(() => setItems(readStored()), []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or blocked — the cart just won't persist */
    }
  }, [items]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        const cap = item.stock > 0 ? item.stock : existing.qty + qty;
        return prev.map((i) =>
          i.id === item.id ? { ...i, ...item, qty: Math.min(i.qty + qty, cap) } : i
        );
      }
      return [...prev, { ...item, qty }];
    });
    setIsOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const value = useMemo<CartApi>(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.price * i.qty, 0),
      add,
      setQty,
      remove,
      clear: () => setItems([]),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false)
    }),
    [items, isOpen, add, setQty, remove]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
