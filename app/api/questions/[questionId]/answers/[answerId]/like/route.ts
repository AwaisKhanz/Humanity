// app/api/questions/[questionId]/answers/[answerId]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getUserFromRequest } from "@/lib/auth-utils";
import { ObjectId } from "mongodb";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string; answerId: string }> }
) {
  try {
    const { answerId } = await params;
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const answer = await dbService.getAnswerById(answerId);
    if (!answer) {
      return NextResponse.json(
        { message: "Answer not found" },
        { status: 404 }
      );
    }

    const success = await dbService.likeAnswer(user.id, answerId);
    if (!success) {
      return NextResponse.json(
        { message: "Answer already liked" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Answer liked successfully" });
  } catch (error) {
    console.error("Error liking answer:", error);
    return NextResponse.json(
      { message: "Failed to like answer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string; answerId: string }> }
) {
  try {
    const { answerId } = await params;
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const answer = await dbService.getAnswerById(answerId);
    if (!answer) {
      return NextResponse.json(
        { message: "Answer not found" },
        { status: 404 }
      );
    }

    const success = await dbService.unlikeAnswer(user.id, answerId);
    if (!success) {
      return NextResponse.json(
        { message: "Answer not liked" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Answer unliked successfully" });
  } catch (error) {
    console.error("Error unliking answer:", error);
    return NextResponse.json(
      { message: "Failed to unlike answer" },
      { status: 500 }
    );
  }
}
