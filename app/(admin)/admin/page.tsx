import { DashboardClient } from "@/components/admin/dashboard";
import { getRecentJobs } from "@/lib/admin-actions";

export default async function AdminDashboard() {
  // Fetch data on the server
  const jobs = await getRecentJobs(5);

  // Pass data to client component
  return <DashboardClient jobs={jobs} />;
}
