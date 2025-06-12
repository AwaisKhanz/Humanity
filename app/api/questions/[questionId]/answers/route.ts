// app/api/questions/[questionId]/answers/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { dbService, JobStatus, JobType, UserRole } from "@/lib/db-service";
import { getUserFromRequest, hasRole } from "@/lib/auth-utils";
import { ObjectId } from "mongodb";

// GET answers for a question
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params; // Await params
    const user = getUserFromRequest(req);
    const isAdmin =
      user && hasRole(user, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") || "likes"; // Default to sorting by likes
    const statusFilter = searchParams.get("status") || "approved"; // Default to approved answers

    // Build query using existing dbService methods
    const answers = await dbService.getAnswersByQuestionId(questionId);

    // Filter and sort answers
    let filteredAnswers = answers;
    if (statusFilter === "approved" || !isAdmin) {
      filteredAnswers = answers.filter(
        (answer: any) => answer.status === JobStatus.APPROVED
      );
    } // Admins can see all answers if status=all

    filteredAnswers.sort((a: any, b: any) => {
      if (sort === "likes") {
        return b.likes - a.likes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Fetch user and author profile data for each answer
    const answersWithUsers = await Promise.all(
      filteredAnswers.map(async (answer: any) => {
        const answerUser = await dbService.getUserById(answer.userId);
        const authorProfile = answerUser?.isAuthor
          ? await dbService.getAuthorProfileByUserId(answer.userId)
          : null;

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
          authorProfile: authorProfile
            ? {
                _id: authorProfile._id,
                imageUrl: authorProfile.imageUrl,
                name: authorProfile.name,
              }
            : null,
        };
      })
    );

    // Serialize ObjectId and Date fields
    const serializedAnswers = answersWithUsers.map((answer) => ({
      ...answer,
      _id: answer._id.toString(),
      questionId: answer.questionId.toString(),
      createdAt: answer.createdAt.toISOString(),
      updatedAt: answer.updatedAt.toISOString(),
      user: answer.user
        ? {
            ...answer.user,
            _id: answer.user._id.toString(),
          }
        : null,
      authorProfile: answer.authorProfile
        ? {
            ...answer.authorProfile,
            _id: answer.authorProfile._id?.toString(),
          }
        : null,
    }));

    return NextResponse.json(serializedAnswers);
  } catch (error) {
    console.error("Error fetching answers:", error);
    return NextResponse.json(
      { message: "Failed to fetch answers" },
      { status: 500 }
    );
  }
}
