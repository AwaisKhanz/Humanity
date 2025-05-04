import { getJobById } from "@/lib/admin-actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format-utils";

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await getJobById(params.id);

  if (!job) {
    notFound();
  }

  function formatJobType(type: string) {
    switch (type) {
      case "new_author":
        return "New Author Profile";
      case "profile_update":
        return "Profile Update";
      case "answer_submission":
        return "Answer Submission";
      default:
        return type;
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Job Details</h1>

      <Card>
        <CardHeader>
          <CardTitle>Job #{job.adminNo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Job ID</h3>
              <p>{typeof job._id === "string" && job._id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Admin Number
              </h3>
              <p>{job.adminNo}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Type</h3>
              <p>{formatJobType(job.type)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    job.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : job.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Submitted By
              </h3>
              <p>
                {job.user
                  ? `${job.user.firstName} ${job.user.lastName} `
                  : "Unknown"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Date Submitted
              </h3>
              <p>{formatDate(job.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
