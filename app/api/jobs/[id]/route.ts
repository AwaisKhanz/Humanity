import { type NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { UserRole, JobStatus, JobType } from "@/lib/types";
import { getUserFromRequest, hasRole } from "@/lib/auth-utils";
import { ObjectId } from "mongodb";

// GET job by ID (Admin and Super Admin only)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(req);

    // Check if user is admin or super admin
    if (!user || !hasRole(user, [UserRole.ADMIN, UserRole.SUPER_ADMIN])) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Get job
    const db = await (await import("@/lib/mongodb")).default;
    const job = await db
      .db()
      .collection("jobs")
      .findOne({ _id: new ObjectId(params.id) });

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    // Get job user
    const jobUser = await dbService.getUserById(job.userId);

    // Get related data
    let relatedData = null;
    if (job.relatedId) {
      switch (job.type) {
        case "new_author":
        case "profile_update":
          relatedData = await dbService.getAuthorProfileByUserId(job.userId);
          break;
        case "answer_submission":
          relatedData = await dbService.getAnswerById(job.relatedId);
          break;
      }
    }

    return NextResponse.json({
      ...job,
      user: jobUser
        ? {
            _id: jobUser._id,
            firstName: jobUser.firstName,
            lastName: jobUser.lastName,
            email: jobUser.email,
          }
        : null,
      relatedData,
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { message: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

// PUT update job status (Admin and Super Admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(req);

    // Check if user is admin or super admin
    if (!user || !hasRole(user, [UserRole.ADMIN, UserRole.SUPER_ADMIN])) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { status } = await req.json();

    // Validate input
    if (!status || !Object.values(JobStatus).includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // Get job
    const db = await (await import("@/lib/mongodb")).default;
    const job = await db
      .db()
      .collection("jobs")
      .findOne({ _id: new ObjectId(params.id) });

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    // Update job status
    await dbService.updateJobStatus(params.id, status);

    // Handle related data based on job type and new status
    if (status === JobStatus.APPROVED) {
      switch (job.type) {
        case JobType.NEW_AUTHOR:
          // Update user to be an author
          await dbService.updateUser(job.userId, { isAuthor: true });
          break;
        case JobType.ANSWER_SUBMISSION:
          if (job.relatedId) {
            // Update answer status
            await dbService.updateAnswerStatus(
              job.relatedId,
              JobStatus.APPROVED
            );
          }
          break;
      }
    } else if (status === JobStatus.REJECTED) {
      switch (job.type) {
        case JobType.ANSWER_SUBMISSION:
          if (job.relatedId) {
            // Update answer status
            await dbService.updateAnswerStatus(
              job.relatedId,
              JobStatus.REJECTED
            );
          }
          break;
      }
    }

    return NextResponse.json({ message: "Job status updated successfully" });
  } catch (error) {
    console.error("Error updating job status:", error);
    return NextResponse.json(
      { message: "Failed to update job status" },
      { status: 500 }
    );
  }
}
