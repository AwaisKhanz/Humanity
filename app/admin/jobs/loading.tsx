export default function JobsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-48 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-5 w-96 bg-gray-200 rounded animate-pulse"></div>

      <div className="space-y-4 mt-8">
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>

        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mt-2"></div>
              <div className="flex justify-between items-center mt-4">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
