import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupposeVeterinary",
  description: "Products and clinic management for SupposeVeterinary",
 manifest: "/manifest-admin.json",
  themeColor: "#1d7a5f",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}