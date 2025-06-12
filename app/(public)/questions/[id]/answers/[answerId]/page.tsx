import Link from "next/link";
import { AnswerDetail } from "@/components/answers/answer-detail";
import { notFound } from "next/navigation";

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ id: string; answerId: string }>;
}) {
  // Separate async function to handle fetch logic
  async function fetchData() {
    const { id, answerId } = await params; // Await params

    try {
      // Fetch question data
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const questionResponse = await fetch(`${baseUrl}/api/questions/${id}`, {
        cache: "no-store",
      });

      if (!questionResponse.ok) {
        notFound();
      }

      const question = await questionResponse.json();

      // Fetch answer data
      const answerResponse = await fetch(
        `${baseUrl}/api/questions/${id}/answers/${answerId}`,
        { cache: "no-store" }
      );

      if (!answerResponse.ok) {
        notFound();
      }

      const answer = await answerResponse.json();

      // Serialize ObjectId and Date fields
      const serializedAnswer = {
        _id: answer._id?.toString(),
        questionId: answer.questionId?.toString(),
        userId: answer.userId?.toString(),
        title: answer.title,
        summary: answer.summary,
        content: answer.content,
        status: answer.status,
        likes: answer.likes,
        createdAt: answer.createdAt
          ? new Date(answer.createdAt).toISOString()
          : undefined,
        updatedAt: answer.updatedAt
          ? new Date(answer.updatedAt).toISOString()
          : undefined,
        user: answer.user
          ? {
              ...answer.user,
              _id: answer.user._id?.toString(),
            }
          : null,
        authorProfile: answer.authorProfile
          ? {
              ...answer.authorProfile,
              _id: answer.authorProfile._id?.toString(),
            }
          : null,
      };

      const serializedQuestion = {
        _id: question._id?.toString(),
        number: question.number,
        title: question.title,
        description: question.description,
        imageUrl: question.imageUrl,
        videoUrl: question.videoUrl,
        createdBy: question.createdBy?.toString(),
        createdAt: question.createdAt
          ? new Date(question.createdAt).toISOString()
          : undefined,
        updatedAt: question.updatedAt
          ? new Date(question.updatedAt).toISOString()
          : undefined,
      };

      return { serializedQuestion, serializedAnswer };
    } catch (error) {
      console.error("Error fetching data:", error);
      notFound();
    }
  }

  // Call the async function and render
  const { serializedQuestion, serializedAnswer } = await fetchData();

  console.log("Serialized Answer:", serializedAnswer);
  console.log("Serialized Question:", serializedQuestion);

  // Format the author name
  const authorName = serializedAnswer.user
    ? `${serializedAnswer.user.firstName || ""} ${
        serializedAnswer.user.lastName || ""
      }`.trim() || "Anonymous"
    : "Anonymous";

  // Get author location from profile
  const authorLocation =
    serializedAnswer.authorProfile?.countryOfResidence || "";

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="">
        <div className="md:col-span-2">
          <AnswerDetail
            questionId={serializedQuestion._id}
            questionNumber={serializedQuestion.number}
            questionTitle={serializedQuestion.title}
            questionDescription={serializedQuestion.description}
            questionImageUrl={serializedQuestion.imageUrl}
            questionVideoUrl={serializedQuestion.videoUrl}
            answerId={serializedAnswer._id} // Use full answerId
            answerTitle={serializedAnswer.title}
            answerSummary={serializedAnswer.summary}
            answerContent={serializedAnswer.content || "No content available"}
            answerCreatedAt={serializedAnswer.createdAt}
            answerUpdatedAt={serializedAnswer.updatedAt}
            authorName={authorName}
            authorLocation={authorLocation}
            authorSlug={serializedAnswer.user?._id}
            authorAvatarUrl={
              serializedAnswer.authorProfile?.imageUrl ||
              "/placeholder.svg?height=80&width=80"
            }
            likes={serializedAnswer.likes || 0}
            userHasLiked={false} // Update with actual logic if needed
          />
        </div>
      </div>
    </div>
  );
}
