import { type NextRequest, NextResponse } from "next/server"
import { dbService } from "@/lib/db-service"

// GET answer by ID
export async function GET(req: NextRequest, { params }: { params: { questionId: string; answerId: string } }) {
  try {
    // Get answer
    const answer = await dbService.getAnswerById(params.answerId)

    if (!answer) {
      return NextResponse.json({ message: "Answer not found" }, { status: 404 })
    }

    // Check if answer belongs to the question
    if (answer.questionId.toString() !== params.questionId) {
      return NextResponse.json({ message: "Answer not found for this question" }, { status: 404 })
    }

    // Get user and author profile
    const answerUser = await dbService.getUserById(answer.userId)
    const authorProfile = answerUser?.isAuthor ? await dbService.getAuthorProfileByUserId(answer.userId) : null

    return NextResponse.json({
      ...answer,
      user: answerUser
        ? {
            _id: answerUser._id,
            firstName: answerUser.firstName,
            lastName: answerUser.lastName,
            isAuthor: answerUser.isAuthor,
          }
        : null,
      authorProfile,
    })
  } catch (error) {
    console.error("Error fetching answer:", error)
    return NextResponse.json({ message: "Failed to fetch answer" }, { status: 500 })
  }
}
