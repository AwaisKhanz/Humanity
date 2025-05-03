import { type NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { UserRole } from "@/lib/types";
import { getUserFromRequest, hasRole } from "@/lib/auth-utils";
import { ObjectId } from "mongodb";

// GET all questions
export async function GET() {
  try {
    const questions = await dbService.getQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { message: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// POST new question (Super Admin only)
export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);

    // Check if user is super admin
    if (!user || !hasRole(user, UserRole.SUPER_ADMIN)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { number, title, description, imageUrl, videoUrl } = await req.json();

    // Validate input
    if (!number || !title || !description) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create question
    const question = await dbService.createQuestion({
      number,
      title,
      description,
      imageUrl,
      videoUrl,
      createdBy: user.id,
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { message: "Failed to create question" },
      { status: 500 }
    );
  }
}
