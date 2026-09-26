"use client";

import { usePathname } from "next/navigation";
import { IconHome, IconBox, IconStethoscope, IconCalendar, IconWallet, IconUsers } from "@/components/Icons";

const links = [
  { href: "/vetsuppose", label: "Overview", icon: <IconHome /> },
  { href: "/vetsuppose/products", label: "Products", icon: <IconBox /> },
  { href: "/vetsuppose/services", label: "Services", icon: <IconStethoscope /> },
  { href: "/vetsuppose/bookings", label: "Appointments", icon: <IconCalendar /> },
  { href: "/vetsuppose/clients", label: "Clients", icon: <IconUsers /> },
  { href: "/vetsuppose/finance", label: "Finance", icon: <IconWallet /> }
];

export default function SideNav() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const active =
          link.href === "/vetsuppose" ? pathname === "/vetsuppose" : pathname.startsWith(link.href);
        return (
          <a
            key={link.href}
            href={link.href}
            className={active ? "active" : ""}
            aria-current={active ? "page" : undefined}
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-label">{link.label}</span>
          </a>
        );
      })}
    </>
  );
}
