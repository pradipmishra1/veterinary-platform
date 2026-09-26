"use client";

import { useEffect } from "react";
import PublicShell from "@/components/PublicShell";
import SiteFooter from "@/components/SiteFooter";
import { site, telHref } from "@/lib/site";
import { IconAlert, IconPhone } from "@/components/Icons";

/**
 * Route-level error boundary. Most failures here are database connectivity, so the
 * fallback deliberately pushes the phone number rather than only offering a retry.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <PublicShell>
      <div className="wrap">
        <div className="empty empty-plain">
          <span className="empty-icon danger">
            <IconAlert />
          </span>
          <h3>Something went wrong on our side</h3>
          <p>
            The page couldn&apos;t load. It&apos;s not something you did — please try again, or call
            us and we&apos;ll help you straight away.
          </p>
          {error.digest && <p className="hint">Reference: {error.digest}</p>}
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={reset}>
              Try again
            </button>
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
