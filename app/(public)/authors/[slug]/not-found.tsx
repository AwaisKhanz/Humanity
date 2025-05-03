import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthorNotFound() {
  return (
    <div className="bg-[#f3f2f2] min-h-screen py-12">
      <div className="container mx-auto px-4 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Author Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              The author profile you're looking for doesn't exist or may have been removed.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/authors">View All Authors</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
