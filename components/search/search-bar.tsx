"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
  redirectToResults?: boolean
}

export function SearchBar({
  placeholder = "Search questions, answers, authors...",
  className = "",
  onSearch,
  redirectToResults = true,
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim())
      }

      if (redirectToResults) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  // Handle click outside to collapse on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <form onSubmit={handleSearch} className={`relative flex items-center ${className}`}>
      <div className={`flex items-center transition-all duration-300 ${isExpanded ? "w-full" : "w-auto md:w-64"}`}>
        <div className="relative w-full">
          <Input
            ref={inputRef}
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="pr-10 w-full"
            aria-label="Search"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            aria-label="Submit search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  )
}
