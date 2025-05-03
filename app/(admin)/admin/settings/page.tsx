import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>Configure general settings for the Humanity website.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Settings functionality will be implemented in a future update.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure email notifications for various events.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Notification settings will be implemented in a future update.</p>
        </CardContent>
      </Card>
    </div>
  )
}
