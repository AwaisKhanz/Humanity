import { SearchResultsSkeleton } from "@/components/search/search-results-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function SearchLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-10 w-full max-w-2xl" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg border p-4">
            <Skeleton className="h-6 w-24 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <SearchResultsSkeleton />
        </div>
      </div>
    </div>
  )
}
