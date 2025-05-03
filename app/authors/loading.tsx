import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function AuthorsLoading() {
  return (
    <div className="bg-[#f3f2f2] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Authors</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the experts and thought leaders who contribute their insights and perspectives to our questions about
            humanity's future.
          </p>
        </div>

        {/* Search Bar Loading */}
        <div className="mb-8 max-w-md mx-auto">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>

        {/* Authors Grid Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4 mx-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
