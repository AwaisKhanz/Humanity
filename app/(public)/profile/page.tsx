"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface UserAnswer {
  _id: string
  questionId: string
  title?: string
  summary: string
  likes: number
  status: string
  createdAt: string
  question?: {
    number: number
    title: string
  }
}

export default function ProfilePage() {
  const { user, authorProfile } = useAuth()
  const router = useRouter()
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/profile")
      return
    }

    async function fetchUserAnswers() {
      try {
        const response = await fetch("/api/user/answers")

        if (!response.ok) {
          throw new Error("Failed to fetch user answers")
        }

        const data = await response.json()
        setUserAnswers(data)
      } catch (error) {
        console.error("Error fetching user answers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAnswers()
  }, [user, router])

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="bg-[#f3f2f2] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar
                  src={authorProfile?.imageUrl || "/placeholder.svg?height=100&width=100"}
                  alt={`${user.firstName} ${user.lastName}`}
                  size="lg"
                  className="mb-4"
                />
                <h2 className="text-xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500 mb-2">{user.email}</p>
                <p className="text-gray-500 mb-4">
                  Role: {user.role === "super_admin" ? "Super Admin" : user.role === "admin" ? "Admin" : "User"}
                </p>

                {user.isAuthor ? (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mb-4">Approved Author</div>
                ) : authorProfile ? (
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mb-4">
                    Author Approval Pending
                  </div>
                ) : (
                  <Link href="/become-author">
                    <Button variant="outline" className="rounded-full mb-4">
                      Become an Author
                    </Button>
                  </Link>
                )}

                {user.role === "admin" || user.role === "super_admin" ? (
                  <Link href="/admin">
                    <Button className="rounded-full w-full mb-2">Admin Dashboard</Button>
                  </Link>
                ) : null}

                <Link href="/profile/edit">
                  <Button variant="outline" className="rounded-full w-full">
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {authorProfile && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Author Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {authorProfile.preNominals && (
                    <div className="mb-2">
                      <span className="font-medium">Pre-Nominals:</span> {authorProfile.preNominals}
                    </div>
                  )}
                  {authorProfile.middleInitials && (
                    <div className="mb-2">
                      <span className="font-medium">Middle Initials:</span> {authorProfile.middleInitials}
                    </div>
                  )}
                  <div className="mb-2">
                    <span className="font-medium">Country:</span> {authorProfile.countryOfResidence}
                  </div>
                  <div className="mb-4">
                    <span className="font-medium">Bio:</span>
                    <p className="mt-1 text-sm">{authorProfile.bio}</p>
                  </div>
                  {authorProfile.links && authorProfile.links.length > 0 && (
                    <div>
                      <span className="font-medium">Links:</span>
                      <ul className="mt-1 space-y-1">
                        {authorProfile.links.map((link, index) => (
                          <li key={index} className="text-sm">
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* User Answers */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Answers</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading your answers...</p>
                ) : userAnswers.length > 0 ? (
                  <div className="space-y-4">
                    {userAnswers.map((answer) => (
                      <div key={answer._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">
                              {answer.question
                                ? `Question ${answer.question.number}: ${answer.question.title}`
                                : "Unknown Question"}
                            </h3>
                            {answer.title && <p className="text-sm font-medium">{answer.title}</p>}
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs ${
                              answer.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : answer.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {answer.status.charAt(0).toUpperCase() + answer.status.slice(1)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{answer.summary}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Likes: {answer.likes}</span>
                          <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                        </div>
                        {answer.status === "approved" && (
                          <div className="mt-2">
                            <Link href={`/questions/${answer.questionId}/answers/${answer._id}`}>
                              <Button variant="outline" size="sm" className="rounded-full">
                                View Answer
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't submitted any answers yet.</p>
                    <Link href="/questions">
                      <Button className="rounded-full">Browse Questions</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
