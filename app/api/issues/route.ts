import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: "MongoDB not configured" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { issue, tableType, userInfo } = body

    // Validate required fields
    if (!issue || !issue.trim()) {
      return NextResponse.json(
        { error: "Issue description is required" },
        { status: 400 }
      )
    }

    try {
      // Connect to the litecoin_treasuries database
      const db = await getDatabase("litecoin_treasuries")
      const userIssuesCollection = db.collection("user_issues")

      // Create the issue document
      const issueDocument = {
        issue: issue.trim(),
        tableType: tableType || "unknown", // "companies" or "etfs"
        userInfo: userInfo || null, // Optional user information
        status: "pending", // pending, reviewed, resolved
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Insert the issue into MongoDB
      const result = await userIssuesCollection.insertOne(issueDocument)

      return NextResponse.json({
        success: true,
        message: "Issue submitted successfully",
        id: result.insertedId.toString(),
      })
    } catch (dbError) {
      console.error("[v0] MongoDB error saving issue:", dbError)
      return NextResponse.json(
        { error: "Failed to save issue", details: dbError instanceof Error ? dbError.message : "Unknown error" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[v0] Error processing issue submission:", error)
    return NextResponse.json(
      { error: "Failed to process issue submission", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

