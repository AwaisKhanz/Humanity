"use server";

import { ObjectId } from "mongodb";
import { dbService } from "./db-service";
import type { Job, JobStatus } from "./types";

// Get recent jobs with a limit
export async function getRecentJobs(limit = 5): Promise<Job[]> {
  try {
    const jobs = await dbService.getJobs();

    console.log(jobs);
    return jobs.slice(0, limit);
  } catch (error) {
    console.error("Error fetching recent jobs:", error);
    return [];
  }
}

// Get all jobs
export async function getAllJobs(): Promise<Job[]> {
  try {
    return await dbService.getJobs();
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    return [];
  }
}

// Update job status
export async function updateJobStatus(
  jobId: string | ObjectId,
  status: JobStatus
): Promise<boolean> {
  try {
    await dbService.updateJobStatus(jobId, status);
    return true;
  } catch (error) {
    console.error("Error updating job status:", error);
    return false;
  }
}

// Get job by ID
export async function getJobById(jobId: string): Promise<Job | null> {
  try {
    const job = await dbService.getJobById(jobId);
    if (!job) {
      return null;
    }
    // Serialize ObjectId and Date fields
    return {
      ...job,
      _id: job._id?.toString(),
      userId: job.userId?.toString(),
      relatedId: job.relatedId?.toString(),
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
      relatedData: job.relatedData
        ? {
            ...job.relatedData,
            _id: job.relatedData._id?.toString(),
            userId: job.relatedData.userId?.toString(),
            questionId: job.relatedData.questionId?.toString(),
            createdAt: job.relatedData.createdAt?.toISOString(),
            updatedAt: job.relatedData.updatedAt?.toISOString(),
            question: job.relatedData.question
              ? {
                  ...job.relatedData.question,
                  _id: job.relatedData.question._id?.toString(),
                }
              : undefined,
          }
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    return null;
  }
}
