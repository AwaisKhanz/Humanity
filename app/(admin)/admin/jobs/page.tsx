import { JobList } from "@/components/admin/job-list"

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Job Management</h1>
      <p className="text-gray-500">
        Review and manage pending jobs such as author applications and answer submissions.
      </p>

      <JobList />
    </div>
  )
}
