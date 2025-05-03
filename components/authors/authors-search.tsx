"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { AuthorsSkeleton } from "./authors-skeleton"
import { AuthorsPagination } from "./authors-pagination"
import { formatAuthorName, truncateText } from "@/lib/format-utils"

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

interface AuthorsSearchProps {
  authors: Author[]
}

export function AuthorsSearch({ authors }: AuthorsSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const authorsPerPage = 9

  // Simulate loading state for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Filter authors based on search term
  useEffect(() => {
    const filtered = authors.filter((author) => {
      const fullName = `${author.firstName} ${author.lastName}`.toLowerCase()
      const country = author.countryOfResidence.toLowerCase()
      const bio = author.bio.toLowerCase()
      const term = searchTerm.toLowerCase()

      return fullName.includes(term) || country.includes(term) || bio.includes(term)
    })

    // Reset to first page when search changes
    setCurrentPage(1)

    // Add a small delay to simulate filtering for better UX
    const timer = setTimeout(() => {
      setFilteredAuthors(filtered)
    }, 300)

    return () => clearTimeout(timer)
  }, [authors, searchTerm])

  // Get current page authors
  const indexOfLastAuthor = currentPage * authorsPerPage
  const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage
  const currentAuthors = filteredAuthors.slice(indexOfFirstAuthor, indexOfLastAuthor)
  const totalPages = Math.ceil(filteredAuthors.length / authorsPerPage)

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {/* Search Bar */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search authors..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search authors"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <AuthorsSkeleton />
      ) : (
        <>
          {/* Authors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentAuthors.map((author) => {
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

          {filteredAuthors.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600">No authors found matching your search criteria.</p>
            </div>
          ) : (
            <AuthorsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </>
  )
}
