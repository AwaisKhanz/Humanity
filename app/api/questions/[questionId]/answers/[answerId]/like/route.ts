import { type NextRequest, NextResponse } from "next/server"
import { dbService } from "@/lib/db-service"
import { getUserFromRequest } from "@/lib/auth-utils"

// POST like an answer
export async function POST(req: NextRequest, { params }: { params: { questionId: string; answerId: string } }) {
  try {
    const user = getUserFromRequest(req)

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if answer exists and is approved
    const answer = await dbService.getAnswerById(params.answerId)
    if (!answer) {
      return NextResponse.json({ message: "Answer not found" }, { status: 404 })
    }

    // Like the answer
    const success = await dbService.likeAnswer(user.id, params.answerId)

    if (!success) {
      return NextResponse.json({ message: "You have already liked this answer" }, { status: 400 })
    }

    return NextResponse.json({ message: "Answer liked successfully" })
  } catch (error) {
    console.error("Error liking answer:", error)
    return NextResponse.json({ message: "Failed to like answer" }, { status: 500 })
  }
}

// DELETE unlike an answer
export async function DELETE(req: NextRequest, { params }: { params: { questionId: string; answerId: string } }) {
  try {
    const user = getUserFromRequest(req)

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Unlike the answer
    const success = await dbService.unlikeAnswer(user.id, params.answerId)

    if (!success) {
      return NextResponse.json({ message: "You have not liked this answer" }, { status: 400 })
    }

    return NextResponse.json({ message: "Answer unliked successfully" })
  } catch (error) {
    console.error("Error unliking answer:", error)
    return NextResponse.json({ message: "Failed to unlike answer" }, { status: 500 })
  }
}
