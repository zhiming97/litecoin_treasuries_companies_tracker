"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { Holding } from "./holdings-dashboard"

interface HoldingsChartProps {
  companies: Holding[]
  etfs: Holding[]
}

export function HoldingsChart({ companies, etfs }: HoldingsChartProps) {
  // Add null checks and default values for ltcHoldings
  const totalCompanyLTC = companies.reduce((sum, c) => sum + (c.ltcHoldings || 0), 0)
  const totalETFLTC = etfs.reduce((sum, e) => sum + (e.ltcHoldings || 0), 0)

  const data = [
    { name: "Companies", value: totalCompanyLTC, color: "#3b82f6" }, // Blue-500
    { name: "ETFs", value: totalETFLTC, color: "#60a5fa" }, // Blue-400 (lighter blue)
  ]

  // Top 5 holders - add type identifier to prevent duplicate keys
  // Filter out items with null/undefined ltcHoldings and add default values
  const companiesWithType = companies
    .filter(c => c.ltcHoldings != null)
    .map(c => ({ ...c, _type: 'company' as const, ltcHoldings: c.ltcHoldings || 0 }))
  const etfsWithType = etfs
    .filter(e => e.ltcHoldings != null)
    .map(e => ({ ...e, _type: 'etf' as const, ltcHoldings: e.ltcHoldings || 0 }))
  const allHoldings = [...companiesWithType, ...etfsWithType]
    .sort((a, b) => (b.ltcHoldings || 0) - (a.ltcHoldings || 0))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribution</CardTitle>
          <CardDescription>Companies vs ETFs</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })} 
                labelFormatter={(name) => name}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => value}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Holders</CardTitle>
          <CardDescription>Largest LTC positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allHoldings.map((holder, index) => (
              <div key={`${holder._type}-${holder._id}`} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium text-foreground">{holder.name}</span>
                    <span className="text-xs font-mono text-muted-foreground">{holder.ticker}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(holder.ltcHoldings || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} LTC
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
