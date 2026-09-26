import type { Metadata } from "next";
import PublicShell from "@/components/PublicShell";
import PageHero from "@/components/PageHero";
import SiteFooter from "@/components/SiteFooter";
import { site, telHref } from "@/lib/site";
import {
  IconStethoscope,
  IconShield,
  IconHeart,
  IconTruck,
  IconPhone,
  IconPaw,
  IconClock,
  IconCheck
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "About the clinic",
  description: `${site.name} is a veterinary clinic and pet supply shop in ${site.address}, run by licensed vets who own pets themselves.`,
  alternates: { canonical: "/about" }
};

const values = [
  {
    icon: <IconStethoscope />,
    title: "Licensed veterinarians",
    body: "Every consultation, vaccination and procedure is carried out by a qualified vet — never a technician working unsupervised."
  },
  {
    icon: <IconShield />,
    title: "Genuine medicine only",
    body: "We buy from authorised distributors and keep the cold chain intact. If we can't verify a product's origin, we don't stock it."
  },
  {
    icon: <IconHeart />,
    title: "Honest advice",
    body: "We'll tell you when a test isn't needed. Recommending treatment your pet doesn't need is the fastest way to lose your trust."
  },
  {
    icon: <IconTruck />,
    title: "We come to you",
    body: "Food and routine supplies can be delivered around the city — message us on WhatsApp and we'll arrange it."
  }
];

const offer = [
  "Vaccinations and annual boosters",
  "Health checkups and diagnostics",
  "Soft-tissue and orthopaedic surgery",
  "Deworming and parasite control",
  "Grooming, nail and dental care",
  "Nutrition and weight plans",
  "Post-operative follow-up",
  "24/7 emergency response"
];

export default function AboutPage() {
  return (
    <PublicShell>
      <PageHero
        title={`About ${site.name}`}
        subtitle={`${site.tagline} — a clinic and pet shop under one roof in ${site.address}.`}
      >
        <a className="btn btn-light" href="/services">
          See our services
        </a>
        <a className="btn btn-light" href={telHref}>
          <IconPhone /> {site.phone}
        </a>
      </PageHero>

      <div className="wrap">
        <div className="info-grid">
          <div className="info-card">
            <h2>
              <IconPaw /> Why we started
            </h2>
            <p>
              We opened because too many pet owners in the neighbourhood were driving across the
              city for a five-minute vaccination, then buying food from whoever happened to have
              stock. Putting a proper clinic and a properly stocked shop in the same building
              fixes both problems in one trip.
            </p>
            <p>
              The team are pet owners first. Every dog and cat that comes through the door is
              treated the way we'd want ours treated — calmly, without rushing, and with the
              costs explained before anything is done.
            </p>
          </div>

          <div className="info-card">
            <h2>
              <IconClock /> How a visit works
            </h2>
            <p>
              Request an appointment on the services page and pick a slot that suits you. We'll
              call the number you leave to confirm — nothing is charged online, and you can change
              or cancel by phone at any time.
            </p>
            <p>
              Walk-ins are welcome too, though booked appointments get seen first. Genuine
              emergencies always jump the queue: call ahead so we can be ready for you.
            </p>
          </div>
        </div>

        <div className="section-head">
          <h2>How we work</h2>
          <p>Four things we don&apos;t compromise on.</p>
        </div>
        <div className="trust-row">
          {values.map((v) => (
            <div className="trust-item" key={v.title}>
              <span className="t-icon">{v.icon}</span>
              <div>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="section-head">
          <h2>What we treat</h2>
          <p>Routine care through to surgery — all in-house.</p>
        </div>
        <div className="info-card">
          <ul className="check-list">
            {offer.map((item) => (
              <li key={item}>
                <IconCheck /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="cta-band">
          <div>
            <h2>Ready to book?</h2>
            <p>Pick a time online, or call and we&apos;ll find you a slot today.</p>
          </div>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/services">
              Book an appointment
            </a>
            <a className="btn" href={telHref}>
              <IconPhone /> Call the clinic
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </PublicShell>
  );
}
