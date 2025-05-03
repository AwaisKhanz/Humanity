import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SearchResultsSkeleton() {
  return (
    <div>
      <Skeleton className="h-5 w-48 mb-4" />

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {index % 3 === 0 && <Skeleton className="h-20 w-20 rounded-full shrink-0" />}

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>

                  <Skeleton className="h-6 w-full max-w-md" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />

                  {index % 2 === 0 && <Skeleton className="h-4 w-1/3 mt-1" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-9" />
        ))}
      </div>
    </div>
  )
}
