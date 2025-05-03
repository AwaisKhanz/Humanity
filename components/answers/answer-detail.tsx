import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Share, ArrowLeft } from "lucide-react"
import { routes } from "@/app/routes"
import { LikeButton } from "./like-button"

interface AnswerDetailProps {
  questionId: string
  questionNumber: number
  questionTitle: string
  answerId: string
  authorName: string
  authorLocation: string
  authorSlug?: string
  authorAvatarUrl?: string
  content: string
  likes?: number
  userHasLiked?: boolean
}

export function AnswerDetail({
  questionId,
  questionNumber,
  questionTitle,
  answerId,
  authorName,
  authorLocation,
  authorSlug,
  authorAvatarUrl,
  content,
  likes = 0,
  userHasLiked = false,
}: AnswerDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="inline-block bg-black text-white text-sm px-4 py-1 rounded-full mb-4">
            ANSWER TO QUESTION {questionNumber}
          </div>
          <h1 className="text-4xl font-bold mb-2">{questionTitle}</h1>
          <p className="text-muted-foreground">NUMBER - {answerId}</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Link href={authorSlug ? `/authors/${authorSlug}` : "#"}>
            <Avatar src={authorAvatarUrl} alt={authorName} size="lg" />
            <h3 className="font-bold mt-2">{authorName.toUpperCase()}</h3>
            <p className="text-sm">{authorLocation}</p>
          </Link>
          <div className="flex gap-2 mt-2">
            <LikeButton
              questionId={questionId}
              answerId={answerId.includes("-") ? answerId.split("-")[1] : answerId}
              initialLikes={likes}
              initialLiked={userHasLiked}
            />
            <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full">
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      <div className="flex justify-between pt-4">
        <Link href={routes.questions.question(questionId)}>
          <Button variant="outline" className="rounded-full flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to list of answers
          </Button>
        </Link>
        <Link href={routes.questions.answer(questionId)}>
          <Button className="rounded-full">Submit your answer</Button>
        </Link>
      </div>
    </div>
  )
}
