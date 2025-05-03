"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  number: z.number().min(1, "Question number must be at least 1"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
})

export default function NewQuestionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: undefined,
      title: "",
      description: "",
      imageUrl: "",
      videoUrl: "",
    },
  })

  if (!user || user.role !== "super_admin") {
    router.push("/admin")
    return null
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create question")
      }

      toast.success("Question created successfully")
      router.push("/admin/questions")
    } catch (error: any) {
      toast.error(error.message || "Failed to create question")
      console.error("Error creating question:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#f3f2f2] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/admin/questions">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Questions
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Question</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Question Number</label>
                <input
                  type="number"
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2"
                  {...register("number", { valueAsNumber: true })}
                />
                {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2"
                  {...register("title")}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 min-h-[150px]"
                  {...register("description")}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL (Optional)</label>
                <input
                  type="text"
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2"
                  {...register("imageUrl")}
                />
                {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Image</label>
                <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-md px-4 py-3">
                  <Upload className="h-5 w-5 text-gray-500" />
                  <div className="text-sm text-gray-500">
                    Browse And Choose The Files You
                    <br />
                    Want To Upload From Your Computer
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Video URL (Optional)</label>
                <input
                  type="text"
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2"
                  {...register("videoUrl")}
                />
                {errors.videoUrl && <p className="text-red-500 text-sm mt-1">{errors.videoUrl.message}</p>}
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-black text-white" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Question"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
