"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AuthorsPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function AuthorsPagination({ currentPage, totalPages, onPageChange }: AuthorsPaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're at the beginning
      if (currentPage <= 2) {
        end = 4
      }

      // Adjust if we're at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("...")
      }

      // Add page numbers
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("...")
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((page, index) => (
        <Button
          key={index}
          variant={page === currentPage ? "default" : "outline"}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={page === "..." ? "cursor-default" : ""}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
