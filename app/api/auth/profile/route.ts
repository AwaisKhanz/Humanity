import { type NextRequest, NextResponse } from "next/server"
import { dbService } from "@/lib/db-service"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(req: NextRequest) {
  try {
    const userData = getUserFromRequest(req)
    if (!userData || !userData.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const user = await dbService.getUserById(userData.id)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Get author profile if user is an author
    let authorProfile = null
    if (user.isAuthor) {
      authorProfile = await dbService.getAuthorProfileByUserId(user._id)
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      authorProfile,
    })
  } catch (error) {
    console.error("Profile error:", error)
    return NextResponse.json({ message: "An error occurred while fetching profile" }, { status: 500 })
  }
}
