import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WhatsAppSupport } from "@/components/ui/WhatsAppSupport";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jersey verse // The Mantle of Conviction",
  description:
    "A cinematic brand experience exploring the emotional weight of a jersey — belief, struggle, and transcendence. Official in-stock matchday kits & bespoke atelier chassis.",
  keywords: [
    "Jersey verse",
    "Jerseyverse",
    "football jerseys",
    "authentic matchday kits",
    "sportswear",
    "scrollytelling",
  ],
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
      </body>
    </html>
  );
}
