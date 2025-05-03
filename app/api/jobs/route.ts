import { type NextRequest, NextResponse } from "next/server"
import { dbService, UserRole, type JobStatus } from "@/lib/db-service"
import { getUserFromRequest, hasRole } from "@/lib/auth-utils"

// GET all jobs (Admin and Super Admin only)
export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req)

    // Check if user is admin or super admin
    if (!user || !hasRole(user, [UserRole.ADMIN, UserRole.SUPER_ADMIN])) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Get status filter from query params
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") as JobStatus | null

    // Get jobs
    const jobs = await dbService.getJobs(status || undefined)

    // Fetch additional data for each job
    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        const jobUser = await dbService.getUserById(job.userId)
        let relatedData = null

        if (job.relatedId) {
          switch (job.type) {
            case "new_author":
            case "profile_update":
              relatedData = await dbService.getAuthorProfileByUserId(job.userId)
              break
            case "answer_submission":
              relatedData = await dbService.getAnswerById(job.relatedId)
              break
          }
        }

        return {
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
        }
      }),
    )

    return NextResponse.json(jobsWithDetails)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ message: "Failed to fetch jobs" }, { status: 500 })
  }
}
