import { SearchResultsSkeleton } from "@/components/search/search-results-skeleton";
import { SearchBar } from "@/components/search/search-bar";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Results</h1>
        <SearchBar
          placeholder="Search again..."
          className="max-w-2xl"
          redirectToResults={true}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg border p-4">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <SearchResultsSkeleton />
        </div>
      </div>
    </div>
  );
}
