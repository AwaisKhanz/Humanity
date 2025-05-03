"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import toast from "react-hot-toast"

interface AnswerFormProps {
  params: {
    id: string
  }
}

const formSchema = z.object({
  title: z.string().optional(),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(100, "Summary cannot exceed 100 characters"),
  content: z
    .string()
    .min(50, "Content must be at least 50 characters")
    .max(5000, "Content cannot exceed 5000 characters"),
  link1: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  link2: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
})

export default function AnswerForm({ params }: AnswerFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [question, setQuestion] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      link1: "",
      link2: "",
    },
  })

  const summaryText = watch("summary") || ""
  const mainText = watch("content") || ""

  useEffect(() => {
    async function fetchQuestion() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/questions/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch question")
        }

        const data = await response.json()
        setQuestion(data)
      } catch (error) {
        console.error("Error fetching question:", error)
        toast.error("Failed to fetch question")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestion()
  }, [params.id])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error("You must be logged in to submit an answer")
      router.push(`/login?redirect=/questions/${params.id}/answer`)
      return
    }

    if (!user.isAuthor) {
      toast.error("You must be an approved author to submit answers")
      router.push("/become-author")
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/questions/${params.id}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          summary: values.summary,
          content: values.content,
          links: [values.link1, values.link2].filter(Boolean),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit answer")
      }

      toast.success("Your answer has been submitted for approval")
      router.push(`/questions/${params.id}`)
    } catch (error: any) {
      toast.error(error.message || "Failed to submit answer")
      console.error("Error submitting answer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-[#f3f2f2]">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-6 text-center">
            <p>Loading question...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-[#f3f2f2]">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="mb-4">You must be logged in to submit an answer.</p>
            <Link href={`/login?redirect=/questions/${params.id}/answer`}>
              <Button className="rounded-full">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!user.isAuthor) {
    return (
      <div className="bg-[#f3f2f2]">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Author Status Required</h2>
            <p className="mb-4">You must be an approved author to submit answers.</p>
            <Link href="/become-author">
              <Button className="rounded-full">Become an Author</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f3f2f2]">
      <div className="container mx-auto px-4 py-8">
        {/* First Form Section */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex justify-center mb-4">
            <Button className="bg-black text-white rounded-md font-medium">SUBMIT YOUR ANSWER HERE</Button>
          </div>

          <p className="text-gray-700 mb-4">
            Thank you for contributing to our community. Your answer will be reviewed by our administrators before being
            published. Please ensure your answer is thoughtful, respectful, and relevant to the question.
          </p>

          <p className="text-gray-700">
            Once approved, your answer will be visible to all users and can receive likes from the community.
          </p>
        </div>

        {/* Detailed Answer Form */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Submit Answer Here</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Selected Question</label>
              <div className="bg-[#f3f2f2] border-0 rounded-md px-4 py-3">
                {question ? (
                  <div>
                    <span className="font-bold">Question {question.number}:</span> {question.title}
                  </div>
                ) : (
                  "Loading question..."
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title (Optional)</label>
                <input
                  type="text"
                  placeholder="Input Text Here"
                  className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3"
                  {...register("title")}
                />
                <div className="mt-1 text-xs text-gray-500">You can add a title but it's optional</div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Add Link 1 (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3"
                    {...register("link1")}
                  />
                  {errors.link1 && <p className="text-red-500 text-sm mt-1">{errors.link1.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Add Link 2 (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3"
                    {...register("link2")}
                  />
                  {errors.link2 && <p className="text-red-500 text-sm mt-1">{errors.link2.message}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Summary</label>
                <div className="relative">
                  <textarea
                    placeholder="Input Text Here"
                    className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3 min-h-[100px]"
                    {...register("summary")}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">{summaryText.length}/100</div>
                </div>
                {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary.message}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Add Image 1 Here (Optional)</label>
                  <div className="flex items-center gap-3 bg-[#f3f2f2] border-0 rounded-md px-4 py-3">
                    <Upload className="h-5 w-5 text-gray-500" />
                    <div className="text-sm text-gray-500">
                      Browse And Choose The Files You
                      <br />
                      Want To Upload From Your Computer
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Add Image 2 Here (Optional)</label>
                  <div className="flex items-center gap-3 bg-[#f3f2f2] border-0 rounded-md px-4 py-3">
                    <Upload className="h-5 w-5 text-gray-500" />
                    <div className="text-sm text-gray-500">
                      Browse And Choose The Files You
                      <br />
                      Want To Upload From Your Computer
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Main Text</label>
              <div className="relative">
                <textarea
                  placeholder="Input Text Here"
                  className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3 min-h-[150px]"
                  {...register("content")}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">{mainText.length}/5000</div>
              </div>
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
            </div>

            <div className="flex justify-center">
              <Button type="submit" className="bg-black text-white rounded-md px-8" disabled={isSubmitting}>
                {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
