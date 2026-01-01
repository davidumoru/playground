import type React from "react"
import type { Metadata } from "next"
import { Inter, Barlow_Condensed } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-barlow-condensed",
})

export const metadata: Metadata = {
  title: "Playground - UI Experiments",
  description: "A collection of interactive UI and creative coding experiments",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${barlowCondensed.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
