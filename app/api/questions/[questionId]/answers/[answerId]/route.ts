// app/api/questions/[questionId]/answers/[answerId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string; answerId: string }> }
) {
  try {
    const { questionId, answerId } = await params;
    const answer = await dbService.getAnswerById(answerId);

    if (!answer || answer.questionId.toString() !== questionId) {
      return NextResponse.json(
        { message: "Answer not found" },
        { status: 404 }
      );
    }

    const answerUser = await dbService.getUserById(answer.userId);
    const authorProfile = answerUser?.isAuthor
      ? await dbService.getAuthorProfileByUserId(answer.userId)
      : null;

    const serializedAnswer = {
      _id: answer._id.toString(),
      questionId: answer.questionId.toString(),
      userId: answer.userId.toString(),
      title: answer.title,
      summary: answer.summary,
      content: answer.content,
      status: answer.status,
      likes: answer.likes,
      createdAt: answer.createdAt.toISOString(),
      updatedAt: answer.updatedAt.toISOString(),
      user: answerUser
        ? {
            _id: answerUser._id.toString(),
            firstName: answerUser.firstName,
            lastName: answerUser.lastName,
            isAuthor: answerUser.isAuthor,
          }
        : null,
      authorProfile: authorProfile
        ? {
            _id: authorProfile._id.toString(),
            imageUrl: authorProfile.imageUrl,
            name: authorProfile.name,
            countryOfResidence: authorProfile.countryOfResidence,
            preNominals: authorProfile.preNominals,
            middleInitials: authorProfile.middleInitials,
            bio: authorProfile.bio,
            links: authorProfile.links,
          }
        : null,
    };

    return NextResponse.json(serializedAnswer);
  } catch (error) {
    console.error("Error fetching answer:", error);
    return NextResponse.json(
      { message: "Failed to fetch answer" },
      { status: 500 }
    );
  }
}
