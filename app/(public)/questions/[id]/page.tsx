"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { QuestionCard } from "@/components/questions/question-card";
import { AnswerCard } from "@/components/answers/answer-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/lib/types";

export default function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = params?.id;
  const { user } = useAuth();
  const isAdmin =
    user &&
    (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN);
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [sort, setSort] = useState<"likes" | "recent">("likes");
  const [status, setStatus] = useState<"approved" | "all">("approved");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const headers: HeadersInit = user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {};

        // Fetch question
        const questionResponse = await fetch(`${baseUrl}/api/questions/${id}`, {
          cache: "no-store",
          headers,
        });

        if (!questionResponse.ok) {
          throw new Error("Question not found");
        }

        const questionData = await questionResponse.json();
        setQuestion(questionData);

        // Fetch answers
        const answersResponse = await fetch(
          `${baseUrl}/api/questions/${id}/answers?sort=${sort}&status=${
            isAdmin ? status : "approved"
          }`,
          { cache: "no-store", headers }
        );

        if (!answersResponse.ok) {
          throw new Error("Failed to fetch answers");
        }

        const answersData = await answersResponse.json();
        setAnswers(answersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, sort, status, user]);

  const handleTopRated = () => setSort("likes");
  const handleViewAll = () => {
    setSort("recent");
    if (isAdmin) setStatus("all");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Question not found
      </div>
    );
  }

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
            <Button
              variant={sort === "likes" ? "default" : "outline"}
              className="rounded-full"
              onClick={handleTopRated}
            >
              Top Rated
            </Button>
            <Button
              variant={
                status === "all" && sort === "recent" ? "default" : "outline"
              }
              className="rounded-full"
              onClick={handleViewAll}
            >
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
                  id={`Q${question.number}-${answer._id.slice(-6)}`}
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
