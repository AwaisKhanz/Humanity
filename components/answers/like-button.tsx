"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface LikeButtonProps {
  questionId: string;
  answerId: string;
  initialLikes: number;
  initialLiked?: boolean;
}

export function LikeButton({
  questionId,
  answerId,
  initialLikes,
  initialLiked = false,
}: LikeButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLike() {
    if (!user) {
      toast.error("You must be logged in to like answers");
      router.push(
        `/login?redirect=/questions/${questionId}/answers/${answerId}`
      );
      return;
    }

    try {
      setIsLoading(true);

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const headers = user.token
        ? { Authorization: `Bearer ${user.token}` }
        : {};

      if (liked) {
        // Unlike
        const response = await fetch(
          `${baseUrl}/api/questions/${questionId}/answers/${answerId}/like`,
          {
            method: "DELETE",
            headers,
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to unlike answer");
        }

        setLikes((prev) => prev - 1);
        setLiked(false);
        toast.success("Answer unliked");
      } else {
        // Like
        const response = await fetch(
          `${baseUrl}/api/questions/${questionId}/answers/${answerId}/like`,
          {
            method: "POST",
            headers,
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to like answer");
        }

        setLikes((prev) => prev + 1);
        setLiked(true);
        toast.success("Answer liked");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update like status");
      console.error("Error updating like status:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant={liked ? "default" : "outline"}
      size="sm"
      className="rounded-full flex items-center gap-2"
      onClick={handleLike}
      disabled={isLoading}
    >
      <ThumbsUp className="h-4 w-4" />
      <span>{likes}</span>
    </Button>
  );
}
