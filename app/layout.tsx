import type { Metadata } from "next";
import { Geist, Geist_Mono, Barlow_Condensed } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import NavLinks from "@/components/NavLinks";
import FooterLeft from "@/components/FooterLeft";
import FooterRight from "@/components/FooterRight";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlow = Barlow_Condensed({
  weight: "900",
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "Playground - David Umoru",
  description: "A collection of interactive experiments, exploring WebGL, Canvas, generative visuals, and creative coding on the web.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${barlow.variable} antialiased bg-white min-h-screen font-sans`}
      >
        <div className="pointer-events-none select-none fixed inset-0 z-40">
          <Header />
          <NavLinks />
          <FooterLeft />
          <FooterRight />
        </div>
        <main className="relative z-0 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
