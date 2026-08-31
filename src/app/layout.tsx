import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WhatsAppSupport } from "@/components/ui/WhatsAppSupport";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://j2-production.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jersey verse // The Mantle of Conviction",
    template: "%s | Jersey verse",
  },
  description:
    "Official matchday kits & bespoke atelier chassis. Authentic player-grade fabrics, liquid 3D crests, and custom name/number heat-press engineering.",
  keywords: [
    "Jersey verse",
    "Jerseyverse Bangladesh",
    "authentic football jerseys Dhaka",
    "retro kits Bangladesh",
    "player issue jerseys",
    "custom name printing",
  ],
  openGraph: {
    title: "Jersey verse // The Mantle of Conviction",
    description: "Official matchday kits in Bangladesh. Upfront bKash/Nagad verification with nationwide fast courier delivery.",
    url: siteUrl,
    siteName: "Jersey verse",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/jerseys_3d/real_madrid_third.jpg",
        width: 1200,
        height: 630,
        alt: "Jersey verse Official Authentic Matchday Kits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jersey verse // The Mantle of Conviction",
    description: "Official matchday kits in Bangladesh with custom player name & number heat-press.",
    images: ["/jerseys_3d/real_madrid_third.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full bg-[#070709] text-zinc-100 antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#070709] selection:bg-amber-500 selection:text-black">
        {children}
        <WhatsAppSupport />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
