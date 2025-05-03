"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobList } from "@/components/admin/job-list"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { UserRole } from "@/lib/db-service"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Pending Jobs"
          description="Review and approve author applications and answer submissions"
          href="/admin/jobs"
          value="View Jobs"
        />

        <DashboardCard
          title="Questions"
          description="Manage questions and create new ones"
          href="/admin/questions"
          value="Manage Questions"
          superAdminOnly
        />

        <DashboardCard
          title="Users"
          description="View and manage user accounts"
          href="/admin/users"
          value="Manage Users"
          superAdminOnly
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Jobs</h2>
        <JobList limit={5} />
        <div className="mt-4 text-right">
          <Link href="/admin/jobs" className="text-blue-600 hover:underline">
            View all jobs →
          </Link>
        </div>
      </div>
    </div>
  )
}

function DashboardCard({
  title,
  description,
  href,
  value,
  superAdminOnly = false,
}: {
  title: string
  description: string
  href: string
  value: string
  superAdminOnly?: boolean
}) {
  const { user } = useAuth()

  // If this card is for super admins only and the user is not a super admin, don't render it
  if (superAdminOnly && user?.role !== UserRole.SUPER_ADMIN) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href={href}
          className="inline-block px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          {value}
        </Link>
      </CardContent>
    </Card>
  )
}
