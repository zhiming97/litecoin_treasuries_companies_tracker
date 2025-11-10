import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"



export async function GET() {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.warn("[v0] MONGODB_URI is not set in environment variables")
      return NextResponse.json({
        companies: [],
        etfs: [],
        _debug: {
          message: "MongoDB not configured",
          hint: "Add MONGODB_URI to your .env.local file",
        },
      })
    }

    try {
      // Connect to the litecoin_treasuries database
      const db = await getDatabase("litecoin_treasuries")
      const treasuaryCompaniesView = db.collection("treasury_companies_view")
      const treasuaryETFCollection = db.collection("exchangetradedfunds")
      const assetPriceCollection = db.collection("asset_price")


      // Fetch all documents from treasuary_companies_view (MongoDB view)
      const companies = await treasuaryCompaniesView.find({}).toArray()
      console.log("[v0] Companies from treasuary_companies_view:", companies.length, companies)
      const etfs = await treasuaryETFCollection.find({}).toArray()

      // Fetch the latest Litecoin price from asset_price collection
      const ltcPriceDoc = await assetPriceCollection
        .find({ asset: "LTC" })
        .sort({ updatedAt: -1, lastUpdated: -1, createdAt: -1 })
        .limit(1)
        .toArray()

      const latestPrice = ltcPriceDoc[0] ?? null
      let priceValue: number | null = null
      if (latestPrice) {
        const possiblePriceKeys = ["price", "priceUSD", "priceUsd", "usdPrice", "value"]
        for (const key of possiblePriceKeys) {
          const value = latestPrice[key as keyof typeof latestPrice]
          if (typeof value === "number") {
            priceValue = value
            break
          }
        }
      }

      const ltcPrice =
        priceValue !== null
          ? {
              value: priceValue,
              currency:
                (typeof latestPrice?.currency === "string" && latestPrice.currency) ||
                (typeof latestPrice?.quoteCurrency === "string" && latestPrice.quoteCurrency) ||
                "USD",
              lastUpdated: latestPrice?.updatedAt
                ? new Date(latestPrice.updatedAt).toISOString()
                : latestPrice?.lastUpdated
                  ? new Date(latestPrice.lastUpdated).toISOString()
                  : latestPrice?._updatedAt
                    ? new Date(latestPrice._updatedAt).toISOString()
                    : null,
            }
          : null

      // Return data from MongoDB
      return NextResponse.json({
        companies: companies,
        etfs: etfs,
        ltcPrice,
      })
    } catch (dbError) {
      console.error("[v0] MongoDB connection failed:", dbError)
      
      // Provide detailed error information
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError)
      const errorCode = (dbError as any)?.code
      const errorCodeName = (dbError as any)?.codeName

      let hint = "Check your MongoDB connection string and credentials"
      
      if (errorCodeName === "AtlasError" || errorMessage.includes("authentication failed")) {
        hint = "Authentication failed. Check your MongoDB username and password in the connection string."
      } else if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("getaddrinfo")) {
        hint = "Cannot resolve MongoDB hostname. Check your connection string and network connectivity."
      } else if (errorMessage.includes("timeout")) {
        hint = "Connection timeout. Check if MongoDB is running and your IP is whitelisted (for Atlas)."
      }

      return NextResponse.json({
        companies: [],
        etfs: [],
        _debug: {
          message: "MongoDB connection failed",
          error: errorMessage,
          code: errorCode,
          codeName: errorCodeName,
          hint: hint,
        },
      })
    }
  } catch (error) {
    console.error("[v0] Error fetching holdings data:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch holdings data", 
        details: error instanceof Error ? error.message : "Unknown error",
        companies: [],
        etfs: [],
      },
      { status: 500 },
    )
  }
}
