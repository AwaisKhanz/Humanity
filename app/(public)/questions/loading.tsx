import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-2/4 mx-auto" />
        </div>

        {/* Featured Question Skeleton */}
        <div className="mb-16">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>

        {/* Questions Grid Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl overflow-hidden shadow h-full flex flex-col"
                >
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Call to Action Skeleton */}
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  );
}
