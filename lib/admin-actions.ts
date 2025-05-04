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
    return await dbService.getJobById(jobId);
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    return null;
  }
}
