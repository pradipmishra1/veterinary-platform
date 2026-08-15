"use client";

import { usePathname } from "next/navigation";

const links = [
  { href: "/vetsuppose", label: "Overview" },
  { href: "/vetsuppose/products", label: "Products" },
  { href: "/vetsuppose/services", label: "Services" },
  { href: "/vetsuppose/bookings", label: "Appointments" },
  { href: "/vetsuppose/clients", label: "Clients" },
  { href: "/vetsuppose/finance", label: "Income & expenses" }
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
            {link.label}
          </a>
        );
      })}
    </>
  );
}