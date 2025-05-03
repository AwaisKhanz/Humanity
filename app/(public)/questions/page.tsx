import { QuestionCard } from "@/components/questions/question-card";

export default async function QuestionsPage() {
  // Fetch questions from the API
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/api/questions`,
    {
      cache: "no-store",
    }
  );
  const questions = await response.json();

  return (
    <div className="bg-[#f3f2f2] min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Questions</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our thought-provoking questions about humanity's future.
            Read answers from experts and contribute your own perspective.
          </p>
        </div>

        <div className="space-y-12">
          {questions.map((question: any) => (
            <div key={question._id} className="bg-white rounded-lg p-8">
              <QuestionCard
                id={question._id}
                number={question.number}
                title={question.title}
                description={question.description}
                imageUrl={question.imageUrl}
                videoUrl={question.videoUrl}
              />
            </div>
          ))}
        </div>

        {questions.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">
              No questions available at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
