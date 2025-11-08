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


      // Fetch all documents from treasuary_companies_view (MongoDB view)
      const companies = await treasuaryCompaniesView.find({}).toArray()
      console.log("[v0] Companies from treasuary_companies_view:", companies.length, companies)
      const etfs = await treasuaryETFCollection.find({}).toArray()


      // Return data from MongoDB
      return NextResponse.json({
        companies: companies,
        etfs: etfs, 
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
