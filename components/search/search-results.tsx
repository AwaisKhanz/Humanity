import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { SearchPagination } from "@/components/search/search-pagination";
import { formatDate } from "@/lib/format-utils";

interface SearchResultsProps {
  query: string;
  type?: string;
  page: number;
}

interface SearchResult {
  id: string;
  type: "question" | "answer" | "author";
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  score: number;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function getSearchResults(
  query: string,
  type?: string,
  page = 1
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: "10",
  });

  if (type) {
    params.append("type", type);
  }

  const res = await fetch(`/api/search?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  return res.json();
}

export async function SearchResults({ query, type, page }: SearchResultsProps) {
  const { results, total, totalPages } = await getSearchResults(
    query,
    type,
    page
  );

  if (results.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-xl font-medium mb-2">No results found</h2>
        <p className="text-gray-600">
          Try different keywords or remove filters
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Found {total} result{total !== 1 ? "s" : ""} for "{query}"
      </p>

      <div className="space-y-4">
        {results.map((result) => (
          <Card key={`${result.type}-${result.id}`} className="overflow-hidden">
            <CardContent className="p-0">
              <Link href={result.url} className="block hover:bg-gray-50">
                <div className="flex p-4 gap-4">
                  {result.imageUrl && result.type === "author" && (
                    <div className="shrink-0">
                      <Image
                        src={result.imageUrl || "/placeholder.svg"}
                        alt={result.title}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          result.type === "question"
                            ? "bg-blue-100 text-blue-800"
                            : result.type === "answer"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {result.type.charAt(0).toUpperCase() +
                          result.type.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(new Date(result.createdAt))}
                      </span>
                    </div>

                    <h3 className="font-medium text-lg mb-1">{result.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {result.description}
                    </p>

                    {result.type === "answer" &&
                      result.metadata?.questionTitle && (
                        <p className="text-xs text-gray-500 mt-2">
                          From question: {result.metadata.questionTitle}
                        </p>
                      )}

                    {result.type === "author" &&
                      result.metadata?.countryOfResidence && (
                        <p className="text-xs text-gray-500 mt-2">
                          {result.metadata.countryOfResidence}
                        </p>
                      )}
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <SearchPagination
            currentPage={page}
            totalPages={totalPages}
            query={query}
            type={type}
          />
        </div>
      )}
    </div>
  );
}
