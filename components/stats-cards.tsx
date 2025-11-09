import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Briefcase, Coins, TrendingUp } from "lucide-react"
import type { Holding } from "./holdings-dashboard"

interface StatsCardsProps {
  companies: Holding[]
  etfs: Holding[]
}

export function StatsCards({ companies, etfs }: StatsCardsProps) {
  const totalCompanyLTC = companies.reduce((sum, c) => sum + c.ltcHoldings, 0)
  const totalETFLTC = etfs.reduce((sum, e) => sum + e.ltcHoldings, 0)
  const totalLTC = totalCompanyLTC + totalETFLTC
  const totalValueUSD = companies.reduce((sum, c) => sum + c.valueUSD, 0) + etfs.reduce((sum, e) => sum + e.valueUSD, 0)

  const stats = [
    {
      title: "Total LTC Holdings",
      value: totalLTC.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      icon: Coins,
      description: "Combined holdings",
    },
    {
      title: "Total Value (USD)",
      value: `$${(totalValueUSD / 1000000).toFixed(2)}M`,
      icon: TrendingUp,
      description: "Market valuation",
    },
    {
      title: "Companies",
      value: companies.length.toString(),
      icon: Building2,
      description: `${totalCompanyLTC.toLocaleString(undefined, { maximumFractionDigits: 0 })} LTC`,
    },
    {
      title: "ETFs",
      value: etfs.length.toString(),
      icon: Briefcase,
      description: `${totalETFLTC.toLocaleString(undefined, { maximumFractionDigits: 0 })} LTC`,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            {stat.title === "Total LTC Holdings" ? (
              <div className="flex items-baseline justify-between text-xs text-muted-foreground mt-1">
                <p>{stat.description}</p>
                <p className="text-[11px]">Total Supply: 84,000,000</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
