import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hiramekun.github.io"),
  title: "ひらめのブログ",
  description: "バックエンドエンジニアの技術メモ",
  icons: {
    icon: [
      { url: '/my-blog/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/my-blog/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/my-blog/favicon-32x32.png',
  },
  openGraph: {
    title: "ひらめのブログ",
    description: "バックエンドエンジニアの技術メモ",
    url: "https://hiramekun.github.io/my-blog/",
    siteName: "ひらめのブログ",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/my-blog/profile.png",
        width: 512,
        height: 512,
        alt: "ひらめのブログのプロフィール画像",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ひらめのブログ",
    description: "バックエンドエンジニアの技術メモ",
    images: ["/my-blog/profile.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
