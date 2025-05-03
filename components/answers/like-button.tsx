"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface LikeButtonProps {
  questionId: string
  answerId: string
  initialLikes: number
  initialLiked?: boolean
}

export function LikeButton({ questionId, answerId, initialLikes, initialLiked = false }: LikeButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(initialLiked)
  const [isLoading, setIsLoading] = useState(false)

  async function handleLike() {
    if (!user) {
      toast.error("You must be logged in to like answers")
      router.push(`/login?redirect=/questions/${questionId}/answers/${answerId}`)
      return
    }

    try {
      setIsLoading(true)

      if (liked) {
        // Unlike
        const response = await fetch(`/api/questions/${questionId}/answers/${answerId}/like`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to unlike answer")
        }

        setLikes((prev) => prev - 1)
        setLiked(false)
        toast.success("Answer unliked")
      } else {
        // Like
        const response = await fetch(`/api/questions/${questionId}/answers/${answerId}/like`, {
          method: "POST",
        })

        if (!response.ok) {
          throw new Error("Failed to like answer")
        }

        setLikes((prev) => prev + 1)
        setLiked(true)
        toast.success("Answer liked")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update like status")
      console.error("Error updating like status:", error)
    } finally {
      setIsLoading(false)
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
  )
}
