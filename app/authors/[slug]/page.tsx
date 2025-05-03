import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ObjectId } from "mongodb"
import type { Metadata, ResolvingMetadata } from "next"
import { formatAuthorName } from "@/lib/format-utils"

interface AuthorPageProps {
  params: {
    slug: string
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: AuthorPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  // Validate that the slug is a valid ObjectId
  let isValidObjectId = false
  try {
    new ObjectId(params.slug)
    isValidObjectId = true
  } catch (error) {
    // Not a valid ObjectId
  }

  if (!isValidObjectId) {
    return {
      title: "Author Not Found",
      description: "The requested author profile could not be found.",
    }
  }

  // Fetch author data
  const db = await (await import("@/lib/mongodb")).default
  const user = await db
    .db()
    .collection("users")
    .findOne({ _id: new ObjectId(params.slug) })

  if (!user || !user.isAuthor) {
    return {
      title: "Author Not Found",
      description: "The requested author profile could not be found.",
    }
  }

  // Fetch author profile
  const authorProfile = await db
    .db()
    .collection("author_profiles")
    .findOne({ userId: new ObjectId(params.slug) })

  if (!authorProfile) {
    return {
      title: "Author Not Found",
      description: "The requested author profile could not be found.",
    }
  }

  // Format author name using utility function
  const authorName = formatAuthorName({
    firstName: user.firstName,
    lastName: user.lastName,
    preNominals: authorProfile.preNominals,
    middleInitials: authorProfile.middleInitials,
  })

  return {
    title: `${authorName} | Author Profile`,
    description: authorProfile.bio
      ? authorProfile.bio.substring(0, 160)
      : `Learn more about ${authorName} and their contributions.`,
    openGraph: {
      title: `${authorName} | Author Profile`,
      description: authorProfile.bio
        ? authorProfile.bio.substring(0, 160)
        : `Learn more about ${authorName} and their contributions.`,
      images: authorProfile.imageUrl ? [authorProfile.imageUrl] : undefined,
    },
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  // Validate that the slug is a valid ObjectId
  let isValidObjectId = false
  try {
    new ObjectId(params.slug)
    isValidObjectId = true
  } catch (error) {
    // Not a valid ObjectId
  }

  if (!isValidObjectId) {
    notFound()
  }

  // Fetch author data
  const db = await (await import("@/lib/mongodb")).default
  const user = await db
    .db()
    .collection("users")
    .findOne({ _id: new ObjectId(params.slug) })

  if (!user || !user.isAuthor) {
    notFound()
  }

  // Fetch author profile
  const authorProfile = await db
    .db()
    .collection("author_profiles")
    .findOne({ userId: new ObjectId(params.slug) })

  if (!authorProfile) {
    notFound()
  }

  // Fetch author's approved answers
  const answers = await db
    .db()
    .collection("answers")
    .find({ userId: new ObjectId(params.slug), status: "approved" })
    .sort({ likes: -1 })
    .toArray()

  // Fetch questions for the answers
  const questionIds = answers.map((answer) => answer.questionId)
  const questions = questionIds.length
    ? await db
        .db()
        .collection("questions")
        .find({ _id: { $in: questionIds } })
        .toArray()
    : []

  // Map questions to answers
  const answersWithQuestions = answers.map((answer) => {
    const question = questions.find((q) => q._id.toString() === answer.questionId.toString())
    return {
      ...answer,
      question,
    }
  })

  // Format author name using utility function
  const authorName = formatAuthorName({
    firstName: user.firstName,
    lastName: user.lastName,
    preNominals: authorProfile.preNominals,
    middleInitials: authorProfile.middleInitials,
  })

  return (
    <div className="bg-[#f3f2f2] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Author Profile Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Author Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar
                  src={authorProfile.imageUrl || "/placeholder.svg?height=150&width=150"}
                  alt={authorName}
                  className="h-32 w-32 mb-4"
                />
                <h1 className="text-xl font-bold">{authorName}</h1>
                <p className="text-gray-500 mb-4">{authorProfile.countryOfResidence}</p>

                {/* Social Links */}
                {authorProfile.links && authorProfile.links.length > 0 && (
                  <div className="flex gap-4 mb-6">
                    {authorProfile.links.map((link, index) => {
                      // Determine icon based on link
                      let icon = <Globe className="h-5 w-5" />
                      if (link.includes("linkedin")) icon = <Linkedin className="h-5 w-5" />
                      if (link.includes("twitter") || link.includes("x.com")) icon = <Twitter className="h-5 w-5" />

                      return (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-100 p-2 rounded-md hover:bg-gray-200"
                          aria-label={`Visit author's social media`}
                        >
                          {icon}
                        </a>
                      )
                    })}
                  </div>
                )}

                {/* Stats */}
                <div className="w-full bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                    <span>Answers:</span>
                    <span className="font-bold">{answers.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Likes:</span>
                    <span className="font-bold">
                      {answers.reduce((total, answer) => total + (answer.likes || 0), 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Author Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>About {authorName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{authorProfile.bio}</p>
                </div>
              </CardContent>
            </Card>

            {/* Author's Answers */}
            <Card>
              <CardHeader>
                <CardTitle>Answers by {authorName}</CardTitle>
              </CardHeader>
              <CardContent>
                {answersWithQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {answersWithQuestions.map((answer) => (
                      <div
                        key={answer._id.toString()}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                      >
                        <h3 className="font-bold mb-1">
                          Question {answer.question?.number}: {answer.question?.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{answer.summary}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="bg-black text-white px-2 py-1 rounded-full text-xs">
                              {answer.likes} likes
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(answer.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Link
                            href={`/questions/${answer.questionId}/answers/${answer._id}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Read answer
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">No answers published yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
