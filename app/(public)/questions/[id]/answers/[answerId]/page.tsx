import { AnswerDetail } from "@/components/answers/answer-detail"
import { ReviewCard } from "@/components/reviews/review-card"
import { notFound } from "next/navigation"

interface AnswerPageProps {
  params: {
    id: string
    answerId: string
  }
}

export default async function AnswerPage({ params }: AnswerPageProps) {
  // Fetch question data
  const questionResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/questions/${params.id}`,
    { cache: "no-store" },
  )

  if (!questionResponse.ok) {
    notFound()
  }

  const question = await questionResponse.json()

  // Fetch answer data
  const answerResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/questions/${params.id}/answers/${params.answerId}`,
    { cache: "no-store" },
  )

  if (!answerResponse.ok) {
    notFound()
  }

  const answer = await answerResponse.json()

  // Mock related reviews data - in a real app, you would fetch this from an API
  const relatedReviews = [
    {
      id: "1",
      title: "Every town should discuss the questions freely",
      authorName: "Dr Piers Robinson",
      authorAvatarUrl: "/placeholder.svg?height=32&width=32",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      title: "Every town should discuss the questions freely",
      authorName: "Dr Piers Robinson",
      authorAvatarUrl: "/placeholder.svg?height=32&width=32",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
  ]

  // Format the author name
  const authorName = answer.user ? `${answer.user.firstName} ${answer.user.lastName}` : "Anonymous"

  // Get author location from profile
  const authorLocation = answer.authorProfile?.countryOfResidence || ""

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <AnswerDetail
            questionId={params.id}
            questionNumber={question.number}
            questionTitle={question.title}
            answerId={`Q${question.number}-${answer._id.toString().slice(-6)}`}
            authorName={authorName}
            authorLocation={authorLocation}
            authorSlug={answer.user?._id}
            authorAvatarUrl={answer.authorProfile?.imageUrl || "/placeholder.svg?height=80&width=80"}
            content={answer.content}
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold">Related Reviews</h3>
          {relatedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              title={review.title}
              authorName={review.authorName}
              authorAvatarUrl={review.authorAvatarUrl}
              imageUrl={review.imageUrl}
              href={`/reviews/${review.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
