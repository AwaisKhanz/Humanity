import { NextResponse } from "next/server"
import { setupMongoDBIndexes } from "@/lib/setup-mongodb-indexes"

// This endpoint can be called to set up MongoDB indexes
// It should be protected in production
export async function GET() {
  try {
    const result = await setupMongoDBIndexes()

    if (result.success) {
      return NextResponse.json({ message: "MongoDB indexes set up successfully" })
    } else {
      return NextResponse.json({ message: "Failed to set up MongoDB indexes", error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Error setting up MongoDB indexes:", error)
    return NextResponse.json({ message: "An error occurred while setting up MongoDB indexes" }, { status: 500 })
  }
}
