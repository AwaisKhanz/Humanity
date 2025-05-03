import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { JobStatus } from "@/lib/db-service"

// Define search result types
type SearchResultType = "question" | "answer" | "author"

// Define search result interface
interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  description: string
  url: string
  imageUrl?: string
  score: number
  createdAt: Date
  metadata?: Record<string, any>
}

export async function GET(req: NextRequest) {
  try {
    // Get search query from URL
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")
    const typeFilter = searchParams.get("type") as SearchResultType | null
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Validate query
    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        results: [],
        total: 0,
        page,
        limit,
        message: "Search query must be at least 2 characters",
      })
    }

    const client = await clientPromise
    const db = client.db("humanity")
    const results: SearchResult[] = []
    let total = 0

    // Build filter based on type
    const typeFilters: SearchResultType[] = typeFilter ? [typeFilter] : ["question", "answer", "author"]

    // Search questions if included in type filter
    if (typeFilters.includes("question")) {
      const questions = await db
        .collection("questions")
        .find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .toArray()

      questions.forEach((question) => {
        results.push({
          id: question._id.toString(),
          type: "question",
          title: question.title,
          description: question.description.substring(0, 200) + (question.description.length > 200 ? "..." : ""),
          url: `/questions/${question._id}`,
          imageUrl: question.imageUrl,
          score: question.score,
          createdAt: question.createdAt,
          metadata: {
            number: question.number,
          },
        })
      })

      total += questions.length
    }

    // Search answers if included in type filter
    if (typeFilters.includes("answer")) {
      const answers = await db
        .collection("answers")
        .find(
          {
            $text: { $search: query },
            status: JobStatus.APPROVED,
          },
          { score: { $meta: "textScore" } },
        )
        .sort({ score: { $meta: "textScore" } })
        .toArray()

      // Get question details for each answer
      const answerResults = await Promise.all(
        answers.map(async (answer) => {
          const question = await db.collection("questions").findOne({ _id: answer.questionId })
          const user = await db.collection("users").findOne({ _id: answer.userId })

          return {
            id: answer._id.toString(),
            type: "answer",
            title: answer.title || (question ? question.title : "Answer"),
            description: answer.summary,
            url: `/questions/${answer.questionId}/answers/${answer._id}`,
            score: answer.score,
            createdAt: answer.createdAt,
            metadata: {
              questionId: answer.questionId.toString(),
              questionTitle: question ? question.title : null,
              authorName: user ? `${user.firstName} ${user.lastName}` : "Unknown Author",
            },
          } as SearchResult
        }),
      )

      results.push(...answerResults)
      total += answers.length
    }

    // Search authors if included in type filter
    if (typeFilters.includes("author")) {
      // First search author profiles
      const authorProfiles = await db
        .collection("author_profiles")
        .find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .toArray()

      // Get user details for each author profile
      const authorProfileResults = await Promise.all(
        authorProfiles.map(async (profile) => {
          const user = await db.collection("users").findOne({ _id: profile.userId })
          if (!user) return null

          return {
            id: user._id.toString(),
            type: "author",
            title: `${user.firstName} ${user.lastName}`,
            description: profile.bio.substring(0, 200) + (profile.bio.length > 200 ? "..." : ""),
            url: `/authors/${user._id}`,
            imageUrl: profile.imageUrl,
            score: profile.score,
            createdAt: profile.createdAt,
            metadata: {
              countryOfResidence: profile.countryOfResidence,
            },
          } as SearchResult
        }),
      )

      // Filter out null results
      results.push(...(authorProfileResults.filter(Boolean) as SearchResult[]))
      total += authorProfileResults.filter(Boolean).length

      // Then search users with isAuthor=true
      const authors = await db
        .collection("users")
        .find(
          {
            $text: { $search: query },
            isAuthor: true,
          },
          { score: { $meta: "textScore" } },
        )
        .sort({ score: { $meta: "textScore" } })
        .toArray()

      // Get author profiles for each user
      const authorResults = await Promise.all(
        authors.map(async (author) => {
          const profile = await db.collection("author_profiles").findOne({ userId: author._id })
          if (!profile) return null

          // Check if this author was already added from the profile search
          const isDuplicate = authorProfileResults.some((result) => result && result.id === author._id.toString())
          if (isDuplicate) return null

          return {
            id: author._id.toString(),
            type: "author",
            title: `${author.firstName} ${author.lastName}`,
            description: profile.bio.substring(0, 200) + (profile.bio.length > 200 ? "..." : ""),
            url: `/authors/${author._id}`,
            imageUrl: profile.imageUrl,
            score: author.score,
            createdAt: author.createdAt,
            metadata: {
              countryOfResidence: profile.countryOfResidence,
            },
          } as SearchResult
        }),
      )

      // Filter out null results
      results.push(...(authorResults.filter(Boolean) as SearchResult[]))
      total += authorResults.filter(Boolean).length
    }

    // Sort results by score
    results.sort((a, b) => b.score - a.score)

    // Apply pagination
    const paginatedResults = results.slice(skip, skip + limit)

    return NextResponse.json({
      results: paginatedResults,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ message: "An error occurred during search" }, { status: 500 })
  }
}
