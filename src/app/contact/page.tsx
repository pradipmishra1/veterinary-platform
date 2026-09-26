import type { Metadata } from "next";
import PublicShell from "@/components/PublicShell";
import PageHero from "@/components/PageHero";
import SiteFooter from "@/components/SiteFooter";
import OpeningHours from "@/components/OpeningHours";
import { site, telHref, whatsappHref } from "@/lib/site";
import {
  IconPhone,
  IconWhatsApp,
  IconMail,
  IconMapPin,
  IconClock,
  IconAlert,
  IconCalendar
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact & opening hours",
  description: `Call ${site.phone}, message us on WhatsApp, or visit ${site.name} in ${site.address}. Open seven days a week, with a 24/7 emergency line.`,
  alternates: { canonical: "/contact" }
};

export default function ContactPage() {
  return (
    <PublicShell>
      <PageHero
        title="Contact us"
        subtitle="Phone, WhatsApp or walk in — whatever is quickest for you. For emergencies, always call."
      >
        <a className="btn btn-light" href={telHref}>
          <IconPhone /> {site.phone}
        </a>
        <a
          className="btn btn-light"
          href={whatsappHref(`Hello ${site.name}, I have a question about my pet.`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconWhatsApp /> WhatsApp
        </a>
      </PageHero>

      <div className="wrap">
        <div className="alert-strip danger">
          <IconAlert />
          <div>
            <strong>Emergency?</strong> Don&apos;t wait for a reply to a message — call{" "}
            <a href={telHref}>{site.phone}</a>. Someone answers 24 hours a day, including holidays.
          </div>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <h2>
              <IconPhone /> Reach us
            </h2>
            <div className="contact-list">
              <a className="contact-row" href={telHref}>
                <span className="c-icon">
                  <IconPhone />
                </span>
                <span>
                  <strong>Call the clinic</strong>
                  <small>{site.phone}</small>
                </span>
              </a>
              <a
                className="contact-row"
                href={whatsappHref(`Hello ${site.name}!`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="c-icon">
                  <IconWhatsApp />
                </span>
                <span>
                  <strong>WhatsApp</strong>
                  <small>Photos, questions and product orders</small>
                </span>
              </a>
              <a className="contact-row" href={`mailto:${site.email}`}>
                <span className="c-icon">
                  <IconMail />
                </span>
                <span>
                  <strong>Email</strong>
                  <small>{site.email}</small>
                </span>
              </a>
              <a
                className="contact-row"
                href={site.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="c-icon">
                  <IconMapPin />
                </span>
                <span>
                  <strong>Visit us</strong>
                  <small>{site.address}</small>
                </span>
              </a>
            </div>
          </div>

          <div className="info-card">
            <h2>
              <IconClock /> Opening hours
            </h2>
            <OpeningHours />
            <p className="hint" style={{ marginTop: 14 }}>
              Times shown are clinic local time ({site.timeZone.replace("_", " ")}). Emergency calls
              are answered outside these hours.
            </p>
          </div>
        </div>

        <div className="cta-band">
          <div>
            <h2>Need an appointment?</h2>
            <p>Pick a service and a time slot — we&apos;ll ring you back to confirm.</p>
          </div>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/services">
              <IconCalendar /> Book online
            </a>
            <a className="btn" href="/">
              Browse the shop
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </PublicShell>
  );
}
