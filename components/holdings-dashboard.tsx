"use client"

import { useEffect, useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CompaniesTable } from "./companies-table"
import { ETFsTable } from "./etfs-table"
import { HoldingsChart } from "./holdings-chart"
import { StatsCards } from "./stats-cards"
import { ThemeToggle } from "./theme-toggle"
import { DonateDialog } from "./donate-dialog"
import Image from "next/image"
import { Heart } from "lucide-react"

export interface Holding {
  _id: string
  name: string
  ticker: string
  ltcHoldings: number
  valueUSD: number
  lastUpdated: string
  percentageOfSupply?: number
}

export interface LitecoinPrice {
  value: number | null
  currency?: string | null
  lastUpdated?: string | null
}

export interface DashboardData {
  companies: Holding[]
  etfs: Holding[]
  ltcPrice: LitecoinPrice | null
}

export function HoldingsDashboard() {
  const [data, setData] = useState<DashboardData>({ companies: [], etfs: [], ltcPrice: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    let isMounted = true
    let hasInitialLoad = true

    async function fetchData(isInitialLoad: boolean) {
      try {
        const response = await fetch("/api/holdings")
        if (!response.ok) throw new Error("Failed to fetch holdings data")
        const result = await response.json()
        
        if (isMounted) {
          setData({
            companies: Array.isArray(result?.companies) ? result.companies : [],
            etfs: Array.isArray(result?.etfs) ? result.etfs : [],
            ltcPrice: result?.ltcPrice ?? null,
          })
          setLastUpdated(new Date())
          setError(null) // Clear any previous errors on successful fetch
        }
      } catch (err) {
        // Only set error on initial load, not on refresh
        if (isMounted && isInitialLoad) {
          setError(err instanceof Error ? err.message : "An error occurred")
        }
        console.error("Error fetching holdings data:", err)
      } finally {
        if (isMounted && isInitialLoad) {
          setLoading(false)
        }
      }
    }

    // Fetch data immediately on mount
    fetchData(hasInitialLoad)
    hasInitialLoad = false

    // Set up interval to fetch data every 5 minutes (300,000 milliseconds)
    const intervalId = setInterval(() => {
      fetchData(false)
    }, 5 * 60 * 1000) // 5 minutes

    // Cleanup interval on unmount
    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading holdings data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const priceValue = typeof data.ltcPrice?.value === "number" ? data.ltcPrice.value : null
  const priceCurrency =
    typeof data.ltcPrice?.currency === "string" && data.ltcPrice.currency.length > 0
      ? data.ltcPrice.currency
      : "USD"
  const formattedPrice =
    priceValue !== null
      ? priceCurrency === "USD"
        ? `$${priceValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
        : `${priceCurrency} ${priceValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      : null
  let formattedLastUpdated: string | null = null
  if (data.ltcPrice?.lastUpdated) {
    const date = new Date(data.ltcPrice.lastUpdated)
    if (!Number.isNaN(date.getTime())) {
      formattedLastUpdated = date.toLocaleString()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card" role="banner">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary overflow-hidden">
              <Image
                src="/litecoin-ltc-icon.png"
                alt="Litecoin Treasuries Tracker Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Litecoin Treasuries Tracker</h1>
              <p className="text-sm text-muted-foreground">Companies & ETF Holdings Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {formattedPrice && (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border/50">
                  <span className="text-sm font-medium text-foreground">LTC</span>
                  <span className="text-sm font-semibold text-primary">{formattedPrice}</span>
                </div>
                <div className="h-6 w-px bg-border" />
              </>
            )}
            <DonateDialog
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 donate-button-effect bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-400/50 hover:border-blue-400 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
                >
                  <Heart className="h-4 w-4 animate-pulse text-red-500" />
                  Donate Litecoin
                </Button>
              }
            />
            <ThemeToggle />
          </div>
      </div>
    </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <StatsCards companies={data.companies} etfs={data.etfs} />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="companies" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="companies">Companies</TabsTrigger>
                <TabsTrigger value="etfs">ETFs</TabsTrigger>
              </TabsList>
              <TabsContent value="companies" className="mt-6">
                <CompaniesTable companies={data.companies} />
              </TabsContent>
              <TabsContent value="etfs" className="mt-6">
                <ETFsTable etfs={data.etfs} />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <HoldingsChart companies={data.companies} etfs={data.etfs} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12" role="contentinfo">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Litecoin Treasuries Tracker © {new Date().getFullYear()}
            </p>
            <p className="text-xs text-muted-foreground">
              Track Litecoin (LTC) holdings across public companies and ETFs. Monitor digital asset treasuries, 
              Litecoin ETF holdings, and institutional Litecoin investments in real-time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
