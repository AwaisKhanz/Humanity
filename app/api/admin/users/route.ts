import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest, hasRole } from "@/lib/auth-utils"
import { UserRole } from "@/lib/db-service"

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)

    // Check if user is super admin
    if (!user || !hasRole(user, UserRole.SUPER_ADMIN)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Get all users
    const db = await (await import("@/lib/mongodb")).default
    const users = await db.db().collection("users").find().sort({ createdAt: -1 }).toArray()

    // Remove sensitive information
    const sanitizedUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json(sanitizedUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 })
  }
}
