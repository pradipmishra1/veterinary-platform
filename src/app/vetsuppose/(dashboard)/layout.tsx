import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import LogoutButton from "@/components/LogoutButton";
import SideNav from "@/components/SideNav";
import { site } from "@/lib/site";
import { IconBell } from "@/components/Icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: `%s · ${site.name} admin` },
  manifest: "/manifest-admin.json",
  robots: { index: false, follow: false }
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Pending requests are the only thing the bell needs to shout about.
  const pending = await prisma.booking.count({ where: { status: "pending" } });

  return (
    <>
      <div className="dash-header-v2">
        <div className="brand">
          <span className="brand-badge">V</span>
          <span className="brand-name">{site.name}</span>
        </div>
        <div className="header-actions">
          <a href="/" className="header-link">
            Shop
          </a>
          <LogoutButton />
          <a
            className="icon-btn"
            href="/vetsuppose/bookings?status=pending"
            aria-label={`${pending} pending appointment request${pending === 1 ? "" : "s"}`}
          >
            <IconBell />
            {pending > 0 && <span className="bell-dot">{pending > 9 ? "9+" : pending}</span>}
          </a>
        </div>
      </div>
      <div className="admin-shell">
        <div className="side">
          <SideNav />
        </div>
        <div className="main">{children}</div>
      </div>
    </>
  );
}
