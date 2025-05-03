import Link from "next/link";

interface SearchFiltersProps {
  activeType: string;
  query: string;
}

export function SearchFilters({ activeType, query }: SearchFiltersProps) {
  const filters = [
    { label: "All", value: "" },
    { label: "Questions", value: "question" },
    { label: "Answers", value: "answer" },
    { label: "Authors", value: "author" },
  ];

  return (
    <div className="bg-white rounded-lg border p-4">
      <h2 className="font-medium mb-4">Filter Results</h2>
      <div className="space-y-2">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={{
              pathname: "/search",
              query: {
                q: query,
                ...(filter.value ? { type: filter.value } : {}),
              },
            }}
            className={`block px-3 py-2 rounded-md text-sm ${
              activeType === filter.value
                ? "bg-blue-50 text-blue-700 font-medium"
                : "hover:bg-gray-50"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
