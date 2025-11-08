import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { ReportIssueDialog } from "./report-issue-dialog"
import type { Holding } from "./holdings-dashboard"
import Image from "next/image"

interface CompaniesTableProps {
  companies: Holding[]
}

function getCompanyLogo(ticker: string, name: string): string {
  const logoMap: Record<string, string> = {
    MSTR: "/microstrategy-logo-orange-lightning-bolt.jpg",
    TSLA: "/tesla-logo-red-t-letter.jpg",
    SQ: "/block-square-logo-white-square-on-black.jpg",
    COIN: "/coinbase-logo-blue-coin.jpg",
    MARA: "/marathon-digital-logo-red-m-letter.jpg",
    RIOT: "/riot-platforms-logo-blue-shield.jpg",
    GLXY: "/galaxy-digital-logo-purple-galaxy.jpg",
    HOOD: "/robinhood-logo-green-feather.jpg",
    LITS: "/litsstrategylogi.png",
    LUXX: "/luxxfoliologo.jpeg",
  }
  return logoMap[ticker] || `/placeholder.svg?height=32&width=32&query=${name} company logo`
}

export function CompaniesTable({ companies }: CompaniesTableProps) {
  const sortedCompanies = [...companies].sort((a, b) => b.ltcHoldings - a.ltcHoldings)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Listed Companies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Ticker</TableHead>
                <TableHead className="text-right">LTC Holdings</TableHead>
                <TableHead className="text-right">Value (USD)</TableHead>
                <TableHead className="text-right">% of Supply</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No company data available
                  </TableCell>
                </TableRow>
              ) : (
                sortedCompanies.map((company) => (
                  <TableRow key={company._id}>
                    <TableCell className="font-medium text-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={getCompanyLogo(company.ticker, company.name) || "/placeholder.svg"}
                            alt={`${company.name} logo`}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <span>{company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="rounded bg-secondary px-2 py-1 text-xs font-mono text-secondary-foreground">
                        {company.ticker}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {company.ltcHoldings.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">${company.valueUSD.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {company.percentageOfSupply ? `${company.percentageOfSupply.toFixed(4)}%` : "N/A"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(company.lastUpdated).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-start">
          <ReportIssueDialog
            tableType="companies"
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                Report Inaccurate Data
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
