import type { Metadata } from "next";
import "./globals.css";
import { NEXT_PUBLIC_URL } from './config';




export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
