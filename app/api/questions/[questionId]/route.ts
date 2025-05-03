import { type NextRequest, NextResponse } from "next/server"
import { dbService, UserRole } from "@/lib/db-service"
import { getUserFromRequest, hasRole } from "@/lib/auth-utils"
import { ObjectId } from "mongodb"

// GET question by ID
export async function GET(req: NextRequest, { params }: { params: { questionId: string } }) {
  try {
    const question = await dbService.getQuestionById(params.questionId)

    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 })
    }

    return NextResponse.json(question)
  } catch (error) {
    console.error("Error fetching question:", error)
    return NextResponse.json({ message: "Failed to fetch question" }, { status: 500 })
  }
}

// PUT update question (Super Admin only)
export async function PUT(req: NextRequest, { params }: { params: { questionId: string } }) {
  try {
    const user = getUserFromRequest(req)

    // Check if user is super admin
    if (!user || !hasRole(user, UserRole.SUPER_ADMIN)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { title, description, imageUrl, videoUrl } = await req.json()

    // Validate input
    if (!title && !description && !imageUrl && !videoUrl) {
      return NextResponse.json({ message: "No fields to update" }, { status: 400 })
    }

    // Get the question
    const question = await dbService.getQuestionById(params.questionId)
    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 })
    }

    // Update the question
    const db = await (await import("@/lib/mongodb")).default
    const result = await db
      .db()
      .collection("questions")
      .updateOne(
        { _id: new ObjectId(params.questionId) },
        {
          $set: {
            ...(title && { title }),
            ...(description && { description }),
            ...(imageUrl && { imageUrl }),
            ...(videoUrl && { videoUrl }),
            updatedAt: new Date(),
          },
        },
      )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "No changes made" }, { status: 304 })
    }

    const updatedQuestion = await dbService.getQuestionById(params.questionId)
    return NextResponse.json(updatedQuestion)
  } catch (error) {
    console.error("Error updating question:", error)
    return NextResponse.json({ message: "Failed to update question" }, { status: 500 })
  }
}

// DELETE question (Super Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { questionId: string } }) {
  try {
    const user = getUserFromRequest(req)

    // Check if user is super admin
    if (!user || !hasRole(user, UserRole.SUPER_ADMIN)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Get the question
    const question = await dbService.getQuestionById(params.questionId)
    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 })
    }

    // Delete the question
    const db = await (await import("@/lib/mongodb")).default
    const result = await db
      .db()
      .collection("questions")
      .deleteOne({ _id: new ObjectId(params.questionId) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Failed to delete question" }, { status: 500 })
    }

    return NextResponse.json({ message: "Question deleted successfully" })
  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json({ message: "Failed to delete question" }, { status: 500 })
  }
}
