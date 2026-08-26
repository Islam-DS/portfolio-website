import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, Syne, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { SceneBackground } from "@/components/effects/SceneBackground";
import { SectionProgress } from "@/components/effects/SectionProgress";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/data/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: "/images/mahbubul.png", width: 600, height: 750, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/images/mahbubul.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${syne.variable} ${instrumentSerif.variable} ${geistMono.variable} font-sans text-[clamp(1.52rem,1.35rem+0.81vw,2.03rem)]`}
      >
        <JsonLd />
        <CinematicBackground />
        <SceneBackground />
        <CustomCursor />
        <SectionProgress />
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
