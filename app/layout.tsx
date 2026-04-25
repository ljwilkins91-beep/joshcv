import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio J",
  description: "Cover letters · cut to fit",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
