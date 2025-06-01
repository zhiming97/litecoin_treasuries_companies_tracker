import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, CreditCard, TrendingUp } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { AssetPriceList } from "./components/AssetPriceList"
import { UserPortfolio } from "./components/UserPortfolio"

interface AssetPrice {
  Key: number;
  name: string;
  price: number;
  growth: number;
}

const cards = [
  {
    id: 1,
    title: "Total Revenue",
    icon: DollarSign,
    amount: "$45,231.89",
    description: "+20.1% from last month",
    trend: "up",
  },
]

function StatCard({ card }: { card: typeof cards[0] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
        <card.icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{card.amount}</div>
        <p className="text-xs text-muted-foreground">{card.description}</p>
        <div
          className={`mt-2 flex items-center text-xs ${card.trend === "up" ? "text-green-500" : "text-red-500"}`}
        >
          <TrendingUp className={`mr-1 h-3 w-3 ${card.trend !== "up" && "transform rotate-180"}`} />
          {card.description.split(" ")[0]}
        </div>
      </CardContent>
    </Card>
  )
}

function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.id} card={card} />
      ))}
    </div>
  )
}

async function TopProducts() {
  const supabase = await createClient()
  console.log('Fetching assets from Supabase...');
  const { data: assetPrices, error } = await supabase
    .from('asset_price')
    .select('*')
  
  if (error) {
    console.error('Error fetching asset prices:', error)
    return <div>Error loading asset prices</div>
  }

  console.log('Server-side fetched assets:', assetPrices)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <AssetPriceList initialAssets={assetPrices || []} />

      </CardContent>
    </Card>
  )
  
}

export default async function HomeLoginPage() {
  return (
    <div className="space-y-4 p-8 pt-6">
      <OverviewCards />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <TopProducts />
        </div>
        <div className="col-span-3">
          <UserPortfolio />
        </div>
      </div>
    </div>
  )
}



