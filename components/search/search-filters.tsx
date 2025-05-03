"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface SearchFiltersProps {
  activeType: string
  query: string
}

export function SearchFilters({ activeType, query }: SearchFiltersProps) {
  const router = useRouter()

  const filters = [
    { label: "All", value: "" },
    { label: "Questions", value: "question" },
    { label: "Answers", value: "answer" },
    { label: "Authors", value: "author" },
  ]

  const handleFilterChange = (type: string) => {
    const params = new URLSearchParams()
    params.set("q", query)

    if (type) {
      params.set("type", type)
    }

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-medium mb-3">Filter by</h3>

      <div className="space-y-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={filter.value === activeType ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleFilterChange(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
