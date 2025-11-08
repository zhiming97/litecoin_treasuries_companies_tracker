import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { ReportIssueDialog } from "./report-issue-dialog"
import type { Holding } from "./holdings-dashboard"
import Image from "next/image"

interface ETFsTableProps {
  etfs: Holding[]
}

function getETFLogo(ticker: string, name: string): string {
  const logoMap: Record<string, string> = {
    GLTC: "/grayscale-logo-gray-g-letter.jpg",
    LTCN: "/proshares-logo-blue-arrow.jpg",
    VLTC: "/vaneck-logo-red-v-letter.jpg",
    FLTC: "/fidelity-logo-green-f.jpg",
    BLTC: "/blackrock-logo-black-rock.jpg",
    ILTC: "/invesco-logo-blue-diamond.jpg",
    LTCC: "/canarycapitalspotltcetflogo.jpeg"
  }
  return logoMap[ticker] || `/placeholder.svg?height=32&width=32&query=${name} ETF logo`
}

export function ETFsTable({ etfs }: ETFsTableProps) {
  const sortedETFs = [...etfs].sort((a, b) => b.ltcHoldings - a.ltcHoldings)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exchange Traded Funds (ETFs)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ETF Name</TableHead>
                <TableHead>Ticker</TableHead>
                <TableHead className="text-right">LTC Holdings</TableHead>
                <TableHead className="text-right">Value (USD)</TableHead>
                <TableHead className="text-right">% of Supply</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedETFs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No ETF data available
                  </TableCell>
                </TableRow>
              ) : (
                sortedETFs.map((etf) => (
                  <TableRow key={etf._id}>
                    <TableCell className="font-medium text-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={getETFLogo(etf.ticker, etf.name) || "/placeholder.svg"}
                            alt={`${etf.name} logo`}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <span>{etf.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="rounded bg-secondary px-2 py-1 text-xs font-mono text-secondary-foreground">
                        {etf.ticker}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {etf.ltcHoldings.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">${etf.valueUSD.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {etf.percentageOfSupply ? `${etf.percentageOfSupply.toFixed(4)}%` : "N/A"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(etf.lastUpdated).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-start">
          <ReportIssueDialog
            tableType="etfs"
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
