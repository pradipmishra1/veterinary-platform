import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import PublicShell from "@/components/PublicShell";
import SiteFooter from "@/components/SiteFooter";
import StorePage from "@/components/StorePage";
import OpeningHours from "@/components/OpeningHours";
import OpenStatus from "@/components/OpenStatus";
import { site, telHref, whatsappHref } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { IconArrowRight, IconHeart, IconPhone, IconShield, IconStethoscope, IconTruck, IconWhatsApp } from "@/components/Icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pet essentials & veterinary care in Kathmandu",
  description: "Shop pet essentials and find veterinary care at SupposeVeterinary in Kathmandu. Order on WhatsApp or call our 24/7 emergency line.",
  alternates: { canonical: "/" }
};

const promises = [
  { icon: <IconStethoscope />, title: "Licensed veterinarians", note: "Care from qualified vets" },
  { icon: <IconShield />, title: "Genuine products", note: "Sourced from authorised distributors" },
  { icon: <IconTruck />, title: "Local delivery", note: "Arrange your order on WhatsApp" }
];

export default async function HomePage() {
  const [products, services] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.service.findMany({ orderBy: { createdAt: "desc" }, take: 3 })
  ]);
  const shopProducts = products.map((p) => ({ ...p, price: Number(p.price) }));
  const clinicServices = services.map((s) => ({ ...s, price: Number(s.price) }));
  const leadProduct = shopProducts.find((p) => p.imageUrl) ?? shopProducts[0];
  const supportingProducts = shopProducts.filter((p) => p.id !== leadProduct?.id && p.imageUrl).slice(0, 2);

  return (
    <PublicShell>
      <div>
        <section className="home-hero">
          <div className="home-hero-copy">
            <div className="hero-meta"><span className="meta-mark" /> PET CARE · KATHMANDU</div>
            <OpenStatus />
            <h1>Everything your pet needs.</h1>
            <p>Food, medicine and everyday essentials in the shop. Veterinary care right next door.</p>
            <div className="hero-actions hero-actions-left">
              <a className="btn btn-primary btn-arrow" href="#shop">Explore the shop <IconArrowRight /></a>
              <a className="btn btn-quiet" href="/services">Clinic services</a>
            </div>
            <div className="hero-local"><span className="local-dot" /> A neighbourhood clinic &amp; pet shop</div>
          </div>

          <div className="hero-showcase" aria-label="From the SupposeVeterinary shop">
            <div className="showcase-orbit orbit-one" />
            <div className="showcase-orbit orbit-two" />
            {leadProduct?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="showcase-main-image" src={leadProduct.imageUrl} alt={leadProduct.name} />
            ) : (
              <div className="showcase-art" aria-hidden="true"><IconHeart /></div>
            )}
            <div className="showcase-caption">
              <span>FROM THE SHOP</span>
              <strong>{leadProduct?.name ?? "Everyday pet essentials"}</strong>
              {leadProduct && <b>{formatPrice(leadProduct.price)}</b>}
            </div>
            {supportingProducts.map((product, index) => (
              <a className={`showcase-float float-${index + 1}`} href={`/products/${product.id}`} key={product.id} aria-label={`View ${product.name}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.imageUrl!} alt="" />
                <span>{product.name}</span>
              </a>
            ))}
            <div className="showcase-stamp"><span>SHOP</span><span>+</span><span>CLINIC</span></div>
          </div>
        </section>

        <section className="promise-band" aria-label="What we offer">
          <div className="promise-inner">
            {promises.map((promise) => (
              <div className="promise-item" key={promise.title}>
                <span className="promise-icon">{promise.icon}</span>
                <span><strong>{promise.title}</strong><small>{promise.note}</small></span>
              </div>
            ))}
            <a className="promise-emergency" href={telHref}><IconHeart /><span><strong>24/7 emergency line</strong><small>Someone always picks up</small></span><IconArrowRight /></a>
          </div>
        </section>

        <section className="shop-section section-wrap" id="shop">
          <div className="section-heading shop-heading">
            <div>
              <span className="eyebrow">THE SUPPOSEVETERINARY SHOP</span>
              <h2>Everyday care, <em>thoughtfully stocked.</em></h2>
              <p>Browse what is currently available. Prices and stock are shown on every product.</p>
            </div>
            <span className="catalog-count">{shopProducts.length.toString().padStart(2, "0")} <small>items<br />in the shop</small></span>
          </div>
          <StorePage products={shopProducts} />
        </section>

        <section className="clinic-section section-wrap">
          <div className="clinic-intro">
            <span className="eyebrow">CARE BEYOND THE SHOP</span>
            <h2>Good care starts with <em>a conversation.</em></h2>
            <p>From checkups and vaccinations to surgery, the clinic and shop are here to make pet care a little easier in Kathmandu.</p>
            <div className="clinic-actions">
              <a className="btn btn-primary" href="/services">Explore clinic care <IconArrowRight /></a>
              <a className="text-link" href={telHref}><IconPhone /> {site.phone}</a>
            </div>
            {clinicServices.length > 0 && (
              <div className="clinic-service-list">
                {clinicServices.map((service) => (
                  <a href="/services" className="clinic-service-link" key={service.id}>
                    <span>{service.category || "CLINIC SERVICE"}</span><strong>{service.name}</strong><IconArrowRight />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="hours-card">
            <div className="hours-card-head"><span className="hours-symbol"><IconStethoscope /></span><div><span className="eyebrow">YOUR LOCAL CLINIC</span><h3>Come by or call.</h3></div></div>
            <p>Find us in {site.address}. See today&apos;s opening hours and plan your visit.</p>
            <OpeningHours />
            <a className="hours-contact" href="/contact">Clinic details &amp; directions <IconArrowRight /></a>
          </div>
        </section>

        <section className="emergency-feature section-wrap">
          <div className="emergency-feature-copy">
            <span className="eyebrow">HERE WHEN IT MATTERS</span>
            <h2>Pet emergency?<br /><em>Call. We answer.</em></h2>
            <p>Our emergency line is open around the clock. For urgent help, call us directly.</p>
          </div>
          <a className="emergency-call" href={telHref}><span className="emergency-call-icon"><IconPhone /></span><span><small>24/7 EMERGENCY LINE</small><strong>{site.phone}</strong></span><IconArrowRight /></a>
        </section>

        <section className="last-cta section-wrap">
          <div><span className="eyebrow">SUPPOSEVETERINARY · KATHMANDU</span><h2>Here for the whole journey.</h2><p>Shop what your pet needs, or get in touch with the clinic team.</p></div>
          <div className="hero-actions"><a className="btn btn-light" href={whatsappHref(`Hello ${site.name}, I have a question about my pet.`)} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> Message us</a><a className="btn btn-light-outline" href="/contact">Contact &amp; hours <IconArrowRight /></a></div>
        </section>
      </div>
      <SiteFooter />
    </PublicShell>
  );
}
