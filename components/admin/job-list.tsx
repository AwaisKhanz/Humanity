"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, CheckCircle, XCircle, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Job, JobStatus } from "@/lib/types";
import { updateJobStatus } from "@/lib/admin-actions";

interface JobListClientProps {
  jobs: Job[];
  limit?: number;
}

export function JobListClient({ jobs, limit }: JobListClientProps) {
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [jobsState, setJobsState] = useState<Job[]>(
    limit && jobs.length > limit ? jobs.slice(0, limit) : jobs
  );
  const router = useRouter();

  async function handleUpdateJobStatus(
    jobId: string,
    status: JobStatus.APPROVED | JobStatus.REJECTED
  ) {
    try {
      setLoading(true);
      const success = await updateJobStatus(jobId, status);

      if (success) {
        toast.success(
          `Job ${status === "approved" ? "approved" : "rejected"} successfully`
        );
        // Update local state
        setJobsState((prevJobs) =>
          prevJobs.map((job) => (job._id === jobId ? { ...job, status } : job))
        );
      } else {
        throw new Error("Failed to update job status");
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status");
    } finally {
      setLoading(false);
      setActiveJob(null);
    }
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

  function formatDate(dateString: Date) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {loading ? (
        <div className="p-8 text-center">Processing...</div>
      ) : jobsState.length === 0 ? (
        <div className="p-8 text-center">No jobs found</div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type of Job
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jobsState.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {job._id?.slice(-6)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.adminNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.user
                    ? `${job.user.firstName} ${job.user.lastName}`
                    : "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatJobType(job.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(job.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      onClick={() =>
                        setActiveJob(activeJob === job._id ? null : job._id)
                      }
                      disabled={loading}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>

                    {activeJob === job._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <Link href={`/admin/jobs/${job._id}`}>
                            <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </button>
                          </Link>
                          {job.status === "pending" && (
                            <>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-gray-100 w-full text-left"
                                onClick={() =>
                                  job._id &&
                                  handleUpdateJobStatus(
                                    job._id,
                                    JobStatus.APPROVED
                                  )
                                }
                                disabled={loading}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </button>

                              <button
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                onClick={() =>
                                  job._id &&
                                  handleUpdateJobStatus(
                                    job._id,
                                    JobStatus.REJECTED
                                  )
                                }
                                disabled={loading}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Legacy component for backward compatibility
export function JobList({ limit }: { limit?: number }) {
  return null; // Deprecated, as jobs should be fetched server-side
}
