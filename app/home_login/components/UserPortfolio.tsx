import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'

interface PortfolioAsset {
  asset: string;
  quantity: number;
}

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export async function UserPortfolio() {
  const supabase = await createClient()
  
  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div>Please log in to view your portfolio</div>
  }


  // Fetch the user's portfolio data
  const { data: portfolioData, error } = await supabase
    .from('portfolio')
    .select('*')  // Select all columns for debugging
    

  // Now filter for the current user
  const userPortfolio = portfolioData?.filter(item => item.user_id === user.id.toString())

  if (error) {
    console.error('Error fetching portfolio:', error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Error: {error.message}</p>
          <p className="text-xs text-muted-foreground">Looking for user_id: {user.id.toString()}</p>
        </CardContent>
      </Card>
    )
  }

  if (!userPortfolio || userPortfolio.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No assets in your portfolio yet.</p>
          <p className="text-xs text-muted-foreground mt-2">Debug Info:</p>
          <pre className="text-xs text-muted-foreground bg-accent/50 p-2 rounded mt-2 overflow-auto">
            {JSON.stringify({
              yourId: user.id,
              yourIdAsString: user.id.toString(),
              allPortfolioData: portfolioData,
              filteredPortfolio: userPortfolio
            }, null, 2)}
          </pre>
        </CardContent>
      </Card>
    )
  }

  // Fetch current asset prices to calculate balances
  const { data: assetPrices, error: priceError } = await supabase
    .from('asset_price')
    .select('name, price')

  console.log('Asset prices:', assetPrices) // Debug asset prices

  const assetPriceMap = new Map(
    assetPrices?.map(item => [item.name, item.price]) || []
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userPortfolio.map((asset: PortfolioAsset) => {
            const currentPrice = assetPriceMap.get(asset.asset) || 0
            const balance = currentPrice * asset.quantity
            
            return (
              <div key={asset.asset} className="flex items-center justify-between p-2 rounded-lg bg-accent/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 relative">
                    <Image
                      src={`/crypto-icons/${asset.asset.toLowerCase()}.svg`}
                      alt={`${asset.asset} icon`}
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{asset.asset}</h4>
                    <p className="text-sm text-muted-foreground">Quantity: {asset.quantity.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(balance)}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(currentPrice)} per unit</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 