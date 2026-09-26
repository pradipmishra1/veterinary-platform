"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { site, telHref, whatsappHref } from "@/lib/site";
import { CartButton } from "@/components/CartDrawer";
import { IconMenu, IconX, IconPhone, IconWhatsApp } from "@/components/Icons";

const navLinks = [
  { href: "/", label: "Shop" },
  { href: "/services", label: "Clinic care" },
  { href: "/about", label: "Our approach" },
  { href: "/contact", label: "Visit us" }
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <div className="emergency-bar">
        <span className="dot" />
        <span>Pet emergency? We answer 24/7 —</span>
        <a href={telHref}>{site.phone}</a>
      </div>

      <header className="site">
        <a href="/" className="logo" aria-label={`${site.name} home`}>
          <span className="logo-badge">V</span>
          <span className="logo-copy"><strong>{site.name}</strong><small>Pet shop &amp; veterinary clinic</small></span>
        </a>

        <nav className="site" aria-label="Main">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} aria-current={isCurrent(l.href) ? "page" : undefined}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="header-right">
          <a
            className="btn btn-primary btn-sm"
            href={whatsappHref(`Hello ${site.name}, I have a question about my pet.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconWhatsApp /> <span>WhatsApp</span>
          </a>
          <CartButton />
          <button
            className="nav-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </header>

      <div className={`nav-drawer${menuOpen ? " open" : ""}`}>
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            aria-current={isCurrent(l.href) ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </a>
        ))}
        <a className="mobile-emergency-link" href={telHref}>
          <IconPhone /> {site.phone}
        </a>
      </div>
    </>
  );
}
