import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * `NEXT_PUBLIC_SITE_URL` lets metadataBase resolve OpenGraph images to absolute
 * URLs. Falls back to localhost so `next build` never warns in development.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`
  },
  description:
    "Pet food, medicine and accessories plus vaccinations, checkups, surgery and 24/7 emergency care from our clinic in Kathmandu.",
  applicationName: site.name,
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png"
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: "Pet shop and veterinary clinic in Kathmandu. Book an appointment or order supplies.",
    locale: "en_NP",
    url: "/"
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: true }
};

// Next 14 wants viewport/themeColor here, not in `metadata`.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d7a5f"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
