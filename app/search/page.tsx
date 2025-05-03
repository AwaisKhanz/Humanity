import { Suspense } from "react"
import { SearchResults } from "@/components/search/search-results"
import { SearchFilters } from "@/components/search/search-filters"
import { SearchBar } from "@/components/search/search-bar"
import { SearchResultsSkeleton } from "@/components/search/search-results-skeleton"

interface SearchPageProps {
  searchParams: {
    q?: string
    type?: string
    page?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""
  const type = searchParams.type || ""
  const page = Number.parseInt(searchParams.page || "1")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Results</h1>
        <SearchBar placeholder="Search again..." className="max-w-2xl" redirectToResults={true} />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0">
          <SearchFilters activeType={type} query={query} />
        </div>

        <div className="flex-1">
          {query ? (
            <Suspense fallback={<SearchResultsSkeleton />}>
              <SearchResults query={query} type={type} page={page} />
            </Suspense>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h2 className="text-xl font-medium mb-2">Enter a search term</h2>
              <p className="text-gray-600">Search for questions, answers, or authors across the platform</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
