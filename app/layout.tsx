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
  title: "ui.davidumoru.me",
  description: "UI & Design Projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white min-h-screen font-sans`}
      >
        <div className="pointer-events-none select-none fixed inset-0 z-40">
          <div className="absolute top-0 left-0 p-4 text-gray-900 font-bold text-lg pointer-events-auto select-auto">
            David Umoru
            <p className="text-gray-500 text-base font-normal">
              Design Engineer
            </p>
          </div>
          <div className="absolute top-0 right-0 p-4 text-gray-700 flex gap-4 text-sm pointer-events-auto select-auto">
            <a
              href="https://davidumoru.me"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Main Site
            </a>
            <a
              href="https://github.com/davidumoru"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
          <div className="absolute bottom-0 left-0 p-4 text-gray-500 text-sm pointer-events-auto select-auto">
            UI & Design Projects
            <br />
            Experimentation & Inspiration
          </div>
          <div className="absolute bottom-0 right-0 p-4 text-gray-500 text-right text-sm pointer-events-auto select-auto">
            <a href="mailto:hey@davidumoru.me" className="hover:underline">
              Contact
            </a>
            <br />
            <a
              href="https://twitter.com/theumoru"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @theumoru
            </a>
          </div>
        </div>
        <main className="relative z-0 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
