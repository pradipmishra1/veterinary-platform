import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupposeVeterinary",
  description: "Products and clinic management for SupposeVeterinary"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}