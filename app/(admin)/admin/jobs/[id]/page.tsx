import { getJobById } from "@/lib/admin-actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format-utils";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Await params
  const job = await getJobById(id);

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
            {/* <div>
              <h3 className="text-sm font-medium text-gray-500">Job ID</h3>
              <p>{job._id || "N/A"}</p>
            </div> */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Admin Number
              </h3>
              <p>{job.adminNo || "N/A"}</p>
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
                {job.user?.firstName && job.user?.lastName
                  ? `${job.user.firstName} ${job.user.lastName}`
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

          {job.relatedData && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Related Data</h3>
              {job.type === "new_author" || job.type === "profile_update" ? (
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Author Name
                    </h4>
                    <p>{job.relatedData.name || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Pre-Nominals
                    </h4>
                    <p>{job.relatedData.preNominals || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Middle Initials
                    </h4>
                    <p>{job.relatedData.middleInitials || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Country of Residence
                    </h4>
                    <p>{job.relatedData.countryOfResidence || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                    <p>{job.relatedData.bio || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Links</h4>
                    <p>
                      {job.relatedData.links && job.relatedData.links.length > 0
                        ? job.relatedData.links.join(", ")
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Image URL
                    </h4>
                    {job.relatedData.imageUrl ? (
                      <a
                        href={job.relatedData.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Image
                      </a>
                    ) : (
                      <p>N/A</p>
                    )}
                  </div>
                </div>
              ) : job.type === "answer_submission" ? (
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Question Title
                    </h4>
                    <p>{job.relatedData.question?.title || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Question Number
                    </h4>
                    <p>{job.relatedData.question?.number || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Question Description
                    </h4>
                    <p>{job.relatedData.question?.description || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Answer Title
                    </h4>
                    <p>{job.relatedData.title || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Answer Summary
                    </h4>
                    <p>{job.relatedData.summary || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Answer Content
                    </h4>
                    <p>{job.relatedData.content || "N/A"}</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
