"use client"

import { useEffect, useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompaniesTable } from "./companies-table"
import { ETFsTable } from "./etfs-table"
import { HoldingsChart } from "./holdings-chart"
import { StatsCards } from "./stats-cards"
import { ThemeToggle } from "./theme-toggle"
import Image from "next/image"

export interface Holding {
  _id: string
  name: string
  ticker: string
  ltcHoldings: number
  valueUSD: number
  lastUpdated: string
  percentageOfSupply?: number
}

export interface DashboardData {
  companies: Holding[]
  etfs: Holding[]
}

export function HoldingsDashboard() {
  const [data, setData] = useState<DashboardData>({ companies: [], etfs: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/holdings")
        if (!response.ok) throw new Error("Failed to fetch holdings data")
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
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
          <ThemeToggle />
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
    </div>
  )
}
