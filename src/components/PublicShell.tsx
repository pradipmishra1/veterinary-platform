"use client";

import CartProvider from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import SiteHeader from "@/components/SiteHeader";

/**
 * Client wrapper for every public page: cart state, header and cart drawer.
 * `children` is still server-rendered — it's passed through as a prop.
 */
export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <SiteHeader />
      <main>{children}</main>
      <CartDrawer />
    </CartProvider>
  );
}
