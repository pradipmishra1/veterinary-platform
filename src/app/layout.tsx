import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Veterinary",
  description: "Products and clinic management for Veterinary"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}