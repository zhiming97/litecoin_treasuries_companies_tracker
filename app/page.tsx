import { HoldingsDashboard } from "@/components/holdings-dashboard"

export const metadata = {
  title: "Litecoin Treasuries Tracker | LTC Holdings Dashboard",
  description: "Track Litecoin (LTC) holdings across public companies and ETFs. Real-time dashboard showing digital asset treasuries, Litecoin ETF holdings, and company LTC reserves.",
}

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Litecoin Treasuries Tracker",
    description: "Track Litecoin (LTC) holdings across public companies and ETFs. Real-time dashboard showing digital asset treasuries and institutional Litecoin investments.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://litecointreasuries.app",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
    },
    keywords: "Litecoin, Litecoin ETF, Litecoin DAT, Digital Asset Treasuries, Litecoin Treasuries, LTC Holdings",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HoldingsDashboard />
    </>
  )
}
