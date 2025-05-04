import { JobListClient } from "@/components/admin/job-list";
import { getAllJobs } from "@/lib/admin-actions";

export default async function JobsPage() {
  // Fetch jobs data server-side
  const jobs = await getAllJobs();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Job Management</h1>
      <p className="text-gray-500">
        Review and manage pending jobs such as author applications and answer
        submissions.
      </p>

      <JobListClient jobs={jobs} />
    </div>
  );
}
