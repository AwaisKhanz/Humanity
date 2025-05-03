"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import AuthorProfileForm from "@/components/author/author-profile-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BecomeAuthorPage() {
  const { user, authorProfile } = useAuth()
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    async function checkAuthorStatus() {
      try {
        // Check if user has a pending author job
        const response = await fetch("/api/jobs?type=new_author&userId=" + user?._id)

        if (response.ok) {
          const jobs = await response.json()
          if (jobs.length > 0) {
            setStatus(jobs[0].status)
          }
        }
      } catch (error) {
        console.error("Error checking author status:", error)
      }
    }

    if (user && !user.isAuthor && !authorProfile) {
      checkAuthorStatus()
    }
  }, [user, authorProfile])

  if (!user) {
    return (
      <div className="bg-[#f3f2f2] min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-6">Become an Author</h1>
            <p className="mb-6">Please log in to become an author.</p>
            <Link href="/login?redirect=/become-author">
              <Button className="rounded-full">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (user.isAuthor) {
    return (
      <div className="bg-[#f3f2f2] min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-6">You are already an author!</h1>
            <p className="mb-6">You can now submit answers to questions.</p>
            <Link href="/questions">
              <Button className="rounded-full">Browse Questions</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (status === "pending") {
    return (
      <div className="bg-[#f3f2f2] min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-6">Author Application Pending</h1>
            <p className="mb-6">
              Your author application is currently being reviewed by our administrators. We'll notify you once it's
              approved.
            </p>
            <Link href="/">
              <Button className="rounded-full">Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f3f2f2] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-6">Become an Author</h1>
          <p className="mb-4">
            To become an author and submit answers to questions, please complete your author profile below. Your profile
            will be reviewed by our administrators.
          </p>
          <p className="mb-4">
            Once approved, you'll be able to submit answers to questions and participate in discussions.
          </p>
        </div>

        <AuthorProfileForm />
      </div>
    </div>
  )
}
