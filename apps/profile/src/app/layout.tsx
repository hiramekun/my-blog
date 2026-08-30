import type { Metadata, Viewport } from "next";
import "./globals.css";
import { generateSiteMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateSiteMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // M3 の surface ロール (light / dark)。tech-notes と同じ値
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaee" },
    { media: "(prefers-color-scheme: dark)", color: "#12140e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
