import type { Metadata } from "next";
import PublicShell from "@/components/PublicShell";
import SiteFooter from "@/components/SiteFooter";
import { site, telHref } from "@/lib/site";
import { IconPaw, IconPhone } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false }
};

export default function NotFound() {
  return (
    <PublicShell>
      <div className="wrap">
        <div className="empty empty-plain">
          <span className="empty-icon">
            <IconPaw />
          </span>
          <h3>That page has wandered off</h3>
          <p>
            The link may be old or mistyped. Try the shop or our clinic services — or call us and
            we&apos;ll point you the right way.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/">
              Go to the shop
            </a>
            <a className="btn" href="/services">
              Clinic services
            </a>
            <a className="btn" href={telHref}>
              <IconPhone /> {site.phone}
            </a>
          </div>
        </div>
      </div>
      <SiteFooter />
    </PublicShell>
  );
}
