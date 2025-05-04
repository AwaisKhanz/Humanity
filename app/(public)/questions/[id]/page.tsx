import Link from "next/link";
import { QuestionCard } from "@/components/questions/question-card";
import { AnswerCard } from "@/components/answers/answer-card";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface QuestionPageProps {
  params: {
    id: string;
  };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  // Fetch question data
  const questionResponse = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/api/questions/${params.id}`,
    { cache: "no-store" }
  );

  if (!questionResponse.ok) {
    notFound();
  }

  const question = await questionResponse.json();

  // Fetch answers for this question
  const answersResponse = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/api/questions/${params.id}/answers`,
    { cache: "no-store" }
  );
  const answers = await answersResponse.json();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Question Section */}
      <div className="mb-12">
        <QuestionCard
          id={question._id}
          number={question.number}
          title={question.title}
          description={question.description}
          imageUrl={question.imageUrl}
          videoUrl={question.videoUrl}
        />
      </div>

      {/* Answers Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Answers to Question {question.number}
          </h2>
          <div className="flex gap-2">
            <Button variant="default" className="rounded-full">
              Top Rated
            </Button>
            <Button variant="outline" className="rounded-full">
              View All
            </Button>
          </div>
        </div>

        {answers.length > 0 ? (
          <div className="border border-border rounded-lg overflow-hidden">
            {answers.map((answer: any, index: number) => (
              <Link
                href={`/questions/${question._id}/answers/${answer._id}`}
                key={answer._id}
              >
                <AnswerCard
                  position={index + 1}
                  name={`${answer.user?.firstName || ""} ${
                    answer.user?.lastName || ""
                  }`}
                  id={`Q${question.number}-${answer._id.toString().slice(-6)}`}
                  likes={answer.likes}
                  avatarUrl={
                    answer.authorProfile?.imageUrl ||
                    "/placeholder.svg?height=40&width=40"
                  }
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-border rounded-lg p-8 text-center">
            <p className="text-gray-600">
              No answers yet. Be the first to answer this question!
            </p>
            <Link
              href={`/questions/${question._id}/answer`}
              className="mt-4 inline-block"
            >
              <Button variant="default" className="rounded-full">
                Submit Your Answer
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Link href={`/questions/${question._id}/answer`}>
          <Button variant="default" className="rounded-full">
            Submit Your Answer
          </Button>
        </Link>
      </div>
    </div>
  );
}
