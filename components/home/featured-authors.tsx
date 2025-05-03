import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { formatAuthorName, truncateText } from "@/lib/format-utils"
import Link from "next/link"
import { Suspense } from "react"
import { AuthorsSkeleton } from "../authors/authors-skeleton"

interface Author {
  _id: string
  firstName: string
  lastName: string
  preNominals?: string
  middleInitials?: string
  countryOfResidence: string
  bio: string
  imageUrl?: string
}

interface FeaturedAuthorsProps {
  authors: Author[]
  limit?: number
}

export function FeaturedAuthors({ authors, limit = 3 }: FeaturedAuthorsProps) {
  // Take only the specified number of authors
  const featuredAuthors = authors.slice(0, limit)

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Featured Authors</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet some of our expert contributors who are helping to shape the conversation about humanity's future.
          </p>
        </div>

        <Suspense fallback={<AuthorsSkeleton />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAuthors.map((author) => {
              // Format author name using utility function
              const authorName = formatAuthorName({
                firstName: author.firstName,
                lastName: author.lastName,
                preNominals: author.preNominals,
                middleInitials: author.middleInitials,
              })

              return (
                <Link href={`/authors/${author._id}`} key={author._id.toString()}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <Avatar
                          src={author.imageUrl || "/placeholder.svg?height=100&width=100"}
                          alt={authorName}
                          className="h-24 w-24 mb-4"
                        />
                        <h2 className="text-xl font-bold">{authorName}</h2>
                        <p className="text-gray-500 mb-4">{author.countryOfResidence}</p>
                        <p className="text-sm text-gray-600 line-clamp-3">{truncateText(author.bio, 150)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </Suspense>

        {featuredAuthors.length > 0 && (
          <div className="text-center mt-8">
            <Link
              href="/authors"
              className="inline-block px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              View All Authors
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
