"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthorProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="bg-[#f3f2f2] min-h-screen py-12">
      <div className="container mx-auto px-4 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Author Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              We encountered an issue while trying to load this author profile. This could be due to a temporary server
              issue or the author profile may not exist.
            </p>
            <p className="text-sm text-gray-500">Error reference: {error.digest}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => reset()} variant="outline">
              Try again
            </Button>
            <Button onClick={() => (window.location.href = "/authors")}>View All Authors</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
