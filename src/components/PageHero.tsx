import OpenStatus from "@/components/OpenStatus";

export default function PageHero({
  title,
  subtitle,
  eyebrow = "SUPPOSEVETERINARY · KATHMANDU",
  showStatus = true,
  children
}: {
  title: string;
  subtitle: string;
  eyebrow?: string;
  showStatus?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-copy">
        <span className="eyebrow page-hero-eyebrow">{eyebrow}</span>
        {showStatus && <OpenStatus />}
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children && <div className="hero-actions hero-actions-left">{children}</div>}
      </div>
      <div className="page-hero-mark" aria-hidden="true"><span>V</span><i /><i /><i /></div>
    </section>
  );
}
