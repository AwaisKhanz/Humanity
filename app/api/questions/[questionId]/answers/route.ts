import { type NextRequest, NextResponse } from "next/server"
import { dbService, JobStatus, JobType } from "@/lib/db-service"
import { getUserFromRequest } from "@/lib/auth-utils"
import { ObjectId } from "mongodb"

// GET answers for a question
export async function GET(req: NextRequest, { params }: { params: { questionId: string } }) {
  try {
    // Get answers
    const answers = await dbService.getAnswersByQuestionId(params.questionId)

    // Fetch user data for each answer
    const answersWithUsers = await Promise.all(
      answers.map(async (answer) => {
        const answerUser = await dbService.getUserById(answer.userId)
        const authorProfile = answerUser?.isAuthor ? await dbService.getAuthorProfileByUserId(answer.userId) : null

        return {
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
        }
      }),
    )

    return NextResponse.json(answersWithUsers)
  } catch (error) {
    console.error("Error fetching answers:", error)
    return NextResponse.json({ message: "Failed to fetch answers" }, { status: 500 })
  }
}

// POST new answer
export async function POST(req: NextRequest, { params }: { params: { questionId: string } }) {
  try {
    const user = getUserFromRequest(req)

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, summary, content } = await req.json()

    // Validate input
    if (!summary || !content) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if question exists
    const question = await dbService.getQuestionById(params.questionId)
    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 })
    }

    // Create answer
    const answer = await dbService.createAnswer({
      questionId: new ObjectId(params.questionId),
      userId: new ObjectId(user.id),
      title,
      summary,
      content,
      status: JobStatus.PENDING,
    })

    // Create job for admin approval
    await dbService.createJob({
      adminNo: `ANS-${Date.now().toString().slice(-6)}`,
      type: JobType.ANSWER_SUBMISSION,
      status: JobStatus.PENDING,
      userId: new ObjectId(user.id),
      relatedId: answer._id,
    })

    return NextResponse.json(answer, { status: 201 })
  } catch (error) {
    console.error("Error creating answer:", error)
    return NextResponse.json({ message: "Failed to create answer" }, { status: 500 })
  }
}
