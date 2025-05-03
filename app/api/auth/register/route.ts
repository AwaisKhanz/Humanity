import { type NextRequest, NextResponse } from "next/server"
import { dbService, UserRole } from "@/lib/db-service"
import { hashPassword } from "@/lib/auth-utils"

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await req.json()

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await dbService.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await dbService.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: UserRole.USER,
      isAuthor: false,
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ message: "User registered successfully", user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}
