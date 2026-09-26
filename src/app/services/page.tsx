import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import PublicShell from "@/components/PublicShell";
import PageHero from "@/components/PageHero";
import SiteFooter from "@/components/SiteFooter";
import ServicesPage from "@/components/ServicesPage";
import OpeningHours from "@/components/OpeningHours";
import { site, telHref, whatsappHref } from "@/lib/site";
import { IconArrowRight, IconPhone, IconWhatsApp } from "@/components/Icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clinic services & appointments",
  description:
    "Vaccinations, health checkups, surgery, grooming and emergency care at SupposeVeterinary in Kathmandu. Request an appointment online — we confirm by phone.",
  alternates: { canonical: "/services" }
};

export default async function Services() {
  const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });

  // Prisma Decimal isn't serializable across the server/client boundary.
  const serializable = services.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    price: Number(s.price),
    durationMin: s.durationMin,
    description: s.description,
    imageUrl: s.imageUrl
  }));

  return (
    <PublicShell>
      <PageHero
        eyebrow="VETERINARY CARE · KATHMANDU"
        title="Care for them, close to home."
        subtitle="Browse services currently listed by the clinic. Call us if you need help choosing the right next step."
      >
        <a className="btn btn-light" href={telHref}>
          <IconPhone /> {site.phone}
        </a>
        <a
          className="btn btn-light"
          href={whatsappHref(`Hello ${site.name}, I'd like to ask about an appointment.`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconWhatsApp /> WhatsApp us
        </a>
      </PageHero>

      <div className="wrap">
        <ServicesPage services={serializable} />
        <section className="clinic-visit-panel">
          <div className="clinic-visit-copy">
            <span className="eyebrow">YOUR VISIT</span>
            <h2>Questions before you come in?</h2>
            <p>Call or message the clinic team. For an emergency, call instead of waiting for a reply.</p>
            <div className="clinic-actions">
              <a className="btn btn-primary" href={telHref}><IconPhone /> Call {site.phone}</a>
              <a className="btn btn-whatsapp-outline" href={whatsappHref(`Hello ${site.name}, I have a question about my pet.`)} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> WhatsApp</a>
            </div>
          </div>
          <div className="clinic-visit-hours"><span className="eyebrow">OPENING HOURS</span><OpeningHours /><a className="text-link" href="/contact">Full clinic details <IconArrowRight /></a></div>
        </section>
      </div>

      <SiteFooter />
    </PublicShell>
  );
}
