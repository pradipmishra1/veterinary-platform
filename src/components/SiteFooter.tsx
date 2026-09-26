import { site, telHref, whatsappHref, openingHours } from "@/lib/site";
import { IconPhone, IconMail, IconMapPin, IconWhatsApp } from "@/components/Icons";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="logo-badge">V</span>
            {site.name}
          </div>
          <p>
            A neighbourhood veterinary clinic and pet supply shop. Vaccinations, checkups,
            surgery and everything your pet needs day to day.
          </p>
          <a className="footer-call" href={telHref}>
            <IconPhone /> {site.phone}
          </a>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <a href="/">Shop products</a>
          <a href="/services">Clinic services</a>
          <a href="/about">About us</a>
          <a href="/contact">Contact &amp; hours</a>
        </div>

        <div className="footer-col">
          <h4>Opening hours</h4>
          {openingHours.map((h) => (
            <p key={h.day} style={{ margin: "0 0 6px", fontSize: 13.5 }}>
              <span style={{ display: "inline-block", minWidth: 88 }}>{h.day}</span>
              {h.label}
            </p>
          ))}
        </div>

        <div className="footer-col">
          <h4>Get in touch</h4>
          <a href={site.mapUrl} target="_blank" rel="noopener noreferrer">
            <IconMapPin /> {site.address}
          </a>
          <a href={`mailto:${site.email}`}>
            <IconMail /> {site.email}
          </a>
          <a href={whatsappHref(`Hello ${site.name}!`)} target="_blank" rel="noopener noreferrer">
            <IconWhatsApp /> Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {year} {site.name}. All rights reserved.
        </span>
        <span>In an emergency, call {site.phone} — we answer 24/7.</span>
      </div>
    </footer>
  );
}
