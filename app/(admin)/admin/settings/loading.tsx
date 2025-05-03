import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-48 bg-gray-200 rounded animate-pulse"></div>

      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    </div>
  )
}
