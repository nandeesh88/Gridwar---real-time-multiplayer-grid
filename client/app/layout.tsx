import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GridWar — claim your territory",
  description: "Real-time shared grid. Click tiles. Own the board.",
};

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