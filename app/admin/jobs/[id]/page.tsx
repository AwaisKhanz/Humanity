"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"

interface JobDetailPageProps {
  params: {
    id: string
  }
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      router.push("/login?redirect=/admin")
      return
    }

    async function fetchJob() {
      try {
        setLoading(true)
        const response = await fetch(`/api/jobs/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch job")
        }

        const data = await response.json()
        setJob(data)
      } catch (error) {
        console.error("Error fetching job:", error)
        toast.error("Failed to fetch job details")
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [params.id, user, router])

  async function updateJobStatus(status: string) {
    try {
      setIsProcessing(true)
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update job status")
      }

      toast.success(`Job ${status === "approved" ? "approved" : "rejected"} successfully`)
      router.push("/admin")
    } catch (error) {
      console.error("Error updating job status:", error)
      toast.error("Failed to update job status")
    } finally {
      setIsProcessing(false)
    }
  }

  function formatJobType(type: string) {
    switch (type) {
      case "new_author":
        return "New Author Profile"
      case "profile_update":
        return "Profile Update"
      case "answer_submission":
        return "Answer Submission"
      default:
        return type
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="bg-[#f3f2f2] min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">Loading job details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="bg-[#f3f2f2] min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">Job not found</p>
              <div className="flex justify-center mt-4">
                <Link href="/admin">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Admin Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f3f2f2] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/admin">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Dashboard
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Job ID</p>
                <p>{job._id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Admin No</p>
                <p>{job.adminNo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p>{formatJobType(job.type)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p
                  className={
                    job.status === "approved"
                      ? "text-green-600"
                      : job.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }
                >
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p>{formatDate(job.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Updated At</p>
                <p>{formatDate(job.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            {job.user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p>
                    {job.user.firstName} {job.user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{job.user.email}</p>
                </div>
              </div>
            ) : (
              <p>User information not available</p>
            )}
          </CardContent>
        </Card>

        {job.relatedData && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {job.type === "new_author" || job.type === "profile_update"
                  ? "Author Profile"
                  : job.type === "answer_submission"
                    ? "Answer"
                    : "Related Data"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {job.type === "new_author" || job.type === "profile_update" ? (
                <div className="space-y-4">
                  {job.relatedData.preNominals && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pre-Nominals</p>
                      <p>{job.relatedData.preNominals}</p>
                    </div>
                  )}
                  {job.relatedData.middleInitials && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Middle Initials</p>
                      <p>{job.relatedData.middleInitials}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Country of Residence</p>
                    <p>{job.relatedData.countryOfResidence}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bio</p>
                    <p className="whitespace-pre-wrap">{job.relatedData.bio}</p>
                  </div>
                  {job.relatedData.links && job.relatedData.links.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Links</p>
                      <ul className="list-disc pl-5">
                        {job.relatedData.links.map((link: string, index: number) => (
                          <li key={index}>
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
                </div>
              ) : job.type === "answer_submission" ? (
                <div className="space-y-4">
                  {job.relatedData.title && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Title</p>
                      <p>{job.relatedData.title}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Summary</p>
                    <p>{job.relatedData.summary}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Content</p>
                    <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">{job.relatedData.content}</div>
                  </div>
                </div>
              ) : (
                <pre className="p-4 bg-gray-50 rounded-md overflow-auto">
                  {JSON.stringify(job.relatedData, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        )}

        {job.status === "pending" && (
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => updateJobStatus("approved")}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              disabled={isProcessing}
            >
              <CheckCircle className="h-5 w-5" />
              Approve
            </Button>
            <Button
              onClick={() => updateJobStatus("rejected")}
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
              disabled={isProcessing}
            >
              <XCircle className="h-5 w-5" />
              Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
