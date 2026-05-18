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

const SITE_TITLE = "Vibe Class│수업에 바이브를 더하다";
const SITE_DESCRIPTION = "교실에서 바로 쓰는 웹앱 수업자료 아카이브";
const OG_IMAGE =
  "https://github.com/So0yeon/vibe-class/raw/main/og-image.png";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://vibe-class.vercel.app",
  ),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "ko_KR",
    siteName: "Vibe Class",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Vibe Class - 수업에 바이브를 더하다",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#0f172a] text-slate-200">
        {children}
      </body>
    </html>
  );
}
