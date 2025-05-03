import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-utils"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the user's answers
    const db = await (await import("@/lib/mongodb")).default
    const answers = await db
      .db()
      .collection("answers")
      .find({ userId: new ObjectId(user.id) })
      .sort({ createdAt: -1 })
      .toArray()

    // Get question details for each answer
    const answersWithQuestions = await Promise.all(
      answers.map(async (answer) => {
        const question = await db.db().collection("questions").findOne({ _id: answer.questionId })

        return {
          ...answer,
          question: question
            ? {
                _id: question._id,
                number: question.number,
                title: question.title,
              }
            : null,
        }
      }),
    )

    return NextResponse.json(answersWithQuestions)
  } catch (error) {
    console.error("Error fetching user answers:", error)
    return NextResponse.json({ message: "Failed to fetch user answers" }, { status: 500 })
  }
}
