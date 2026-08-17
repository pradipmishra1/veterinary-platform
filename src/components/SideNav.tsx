"use client";

import { usePathname } from "next/navigation";

const links = [
  { href: "/vetsuppose", label: "Overview", icon: "🏠" },
  { href: "/vetsuppose/products", label: "Products", icon: "📦" },
  { href: "/vetsuppose/services", label: "Services", icon: "🩺" },
  { href: "/vetsuppose/bookings", label: "Appointments", icon: "📅" },
  { href: "/vetsuppose/finance", label: "Finance", icon: "💰" }
];

export default function SideNav() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const active =
          link.href === "/vetsuppose" ? pathname === "/vetsuppose" : pathname.startsWith(link.href);
        return (
          <a key={link.href} href={link.href} className={active ? "active" : ""}>
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-label">{link.label}</span>
          </a>
        );
      })}
    </>
  );
}