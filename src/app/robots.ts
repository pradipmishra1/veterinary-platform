import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The dashboard is behind a session cookie anyway; keep it out of indexes too.
        disallow: ["/vetsuppose", "/api"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
