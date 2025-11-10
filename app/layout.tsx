import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Litecoin Treasuries Tracker | LTC Holdings Dashboard",
    template: "%s | Litecoin Treasuries Tracker",
  },
  description: "Track Litecoin (LTC) holdings across public companies and ETFs. Real-time dashboard showing digital asset treasuries, Litecoin ETF holdings, and company LTC reserves. Monitor institutional Litecoin investments and treasury data.",
  keywords: [
    "Litecoin",
    "Litecoin ETF",
    "Litecoin DAT",
    "Digital Asset Treasuries",
    "Litecoin Treasuries",
    "LTC Holdings",
    "Litecoin Companies",
    "Litecoin ETF Holdings",
    "Cryptocurrency Treasuries",
    "Bitcoin Treasuries",
    "Institutional Litecoin",
    "LTC Reserves",
    "Litecoin Dashboard",
    "Litecoin Tracker",
  ],
  authors: [{ name: "Litecoin Treasuries Tracker" }],
  creator: "Litecoin Treasuries Tracker",
  publisher: "Litecoin Treasuries Tracker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://litecoin-treasuries-tracker.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Litecoin Treasuries Tracker | LTC Holdings Dashboard",
    description: "Track Litecoin (LTC) holdings across public companies and ETFs. Real-time dashboard showing digital asset treasuries and institutional Litecoin investments.",
    siteName: "Litecoin Treasuries Tracker",
    images: [
      {
        url: "/litecoin-ltc-logo.svg",
        width: 1200,
        height: 630,
        alt: "Litecoin Treasuries Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Litecoin Treasuries Tracker | LTC Holdings Dashboard",
    description: "Track Litecoin holdings across public companies and ETFs. Real-time dashboard for digital asset treasuries.",
    images: ["/litecoin-ltc-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/litecoin-ltc-logo.svg",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider defaultTheme="dark" storageKey="litecoin-dashboard-theme">
          {children}
        </ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
