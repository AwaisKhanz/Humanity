import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthorProfileLoading() {
  return (
    <div className="bg-[#f3f2f2] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Author Profile Sidebar Loading State */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Author Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Skeleton className="h-32 w-32 rounded-full mb-4" />
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-6" />

                {/* Social Links Loading */}
                <div className="flex gap-4 mb-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-9 w-9 rounded-md" />
                  ))}
                </div>

                {/* Stats Loading */}
                <div className="w-full bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                    <span>Answers:</span>
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Likes:</span>
                    <Skeleton className="h-4 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Author Content Loading State */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio Loading */}
            <Card>
              <CardHeader>
                <CardTitle>
                  About <Skeleton className="h-6 w-32 inline-block" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>

            {/* Author's Answers Loading */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Answers by <Skeleton className="h-6 w-32 inline-block" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
