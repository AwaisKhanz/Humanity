import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share, ArrowLeft } from "lucide-react";
import { routes } from "@/app/routes";
import { LikeButton } from "./like-button";

interface AnswerDetailProps {
  questionId: string;
  questionNumber: number;
  questionTitle: string;
  questionDescription: string;
  questionImageUrl?: string;
  questionVideoUrl?: string;
  answerId: string;
  answerTitle?: string;
  answerSummary?: string;
  answerContent: string;
  answerCreatedAt?: string;
  answerUpdatedAt?: string;
  authorName: string;
  authorLocation: string;
  authorSlug?: string;
  authorAvatarUrl?: string;
  likes?: number;
  userHasLiked?: boolean;
}

export function AnswerDetail({
  questionId,
  questionNumber,
  questionTitle,
  questionDescription,
  questionImageUrl,
  questionVideoUrl,
  answerId,
  answerTitle,
  answerSummary,
  answerContent,
  answerCreatedAt,
  answerUpdatedAt,
  authorName,
  authorLocation,
  authorSlug,
  authorAvatarUrl,
  likes = 0,
  userHasLiked = false,
}: AnswerDetailProps) {
  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="inline-block bg-black text-white text-sm px-4 py-1 rounded-full mb-4">
            ANSWER TO QUESTION {questionNumber}
          </div>
          <h1 className="text-4xl font-bold mb-2">{questionTitle}</h1>
          <p className="text-muted-foreground">ANSWER ID: {answerId}</p>
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
              answerId={
                answerId.includes("-") ? answerId.split("-")[1] : answerId
              }
              initialLikes={likes}
              initialLiked={userHasLiked}
            />
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 rounded-full"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Question Description</h3>
          <p className="prose max-w-none">
            {questionDescription || "No description available"}
          </p>
        </div>

        {questionImageUrl && (
          <div>
            <h3 className="text-lg font-semibold">Question Image</h3>
            <img
              src={questionImageUrl}
              alt="Question Image"
              className="max-w-full h-auto rounded-md"
            />
          </div>
        )}

        {questionVideoUrl && (
          <div>
            <h3 className="text-lg font-semibold">Question Video</h3>
            <video
              src={questionVideoUrl}
              controls
              className="max-w-full h-auto rounded-md"
            />
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold">Answer Title</h3>
          <p className="prose max-w-none">
            {answerTitle || "No title provided"}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Answer Summary</h3>
          <p className="prose max-w-none">
            {answerSummary || "No summary provided"}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Answer Content</h3>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: answerContent }}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold">Metadata</h3>
          <p>
            <strong>Created At:</strong> {formatDate(answerCreatedAt)}
          </p>
          <p>
            <strong>Updated At:</strong> {formatDate(answerUpdatedAt)}
          </p>
          <p>
            <strong>Likes:</strong> {likes}
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Link href={routes.questions.question(questionId)}>
          <Button
            variant="outline"
            className="rounded-full flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list of answers
          </Button>
        </Link>
        <Link href={routes.questions.answer(questionId)}>
          <Button className="rounded-full">Submit your answer</Button>
        </Link>
      </div>
    </div>
  );
}
