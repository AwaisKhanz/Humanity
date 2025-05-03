import { type NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { JobType, JobStatus } from "@/lib/types";
import { getUserFromRequest } from "@/lib/auth-utils";
import { ObjectId } from "mongodb";

// POST create author profile
export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      preNominals,
      middleInitials,
      countryOfResidence,
      bio,
      links,
      imageUrl,
    } = await req.json();

    // Validate input
    if (!countryOfResidence || !bio) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already has an author profile
    const existingProfile = await dbService.getAuthorProfileByUserId(user.id);
    if (existingProfile) {
      return NextResponse.json(
        { message: "Author profile already exists" },
        { status: 409 }
      );
    }

    // Create author profile
    const profile = await dbService.createAuthorProfile({
      userId: user.id,
      preNominals,
      middleInitials,
      countryOfResidence,
      bio,
      links: links || [],
      imageUrl,
    });

    // Create job for admin approval
    await dbService.createJob({
      adminNo: `AUTH-${Date.now().toString().slice(-6)}`,
      type: JobType.NEW_AUTHOR,
      status: JobStatus.PENDING,
      userId: user.id,
      relatedId: profile._id,
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("Error creating author profile:", error);
    return NextResponse.json(
      { message: "Failed to create author profile" },
      { status: 500 }
    );
  }
}

// GET current user's author profile
export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get author profile
    const profile = await dbService.getAuthorProfileByUserId(user.id);

    if (!profile) {
      return NextResponse.json(
        { message: "Author profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching author profile:", error);
    return NextResponse.json(
      { message: "Failed to fetch author profile" },
      { status: 500 }
    );
  }
}

// PUT update author profile
export async function PUT(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      preNominals,
      middleInitials,
      countryOfResidence,
      bio,
      links,
      imageUrl,
    } = await req.json();

    // Validate input
    if (
      !countryOfResidence &&
      !bio &&
      !links &&
      !imageUrl &&
      !preNominals &&
      !middleInitials
    ) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }

    // Check if user has an author profile
    const existingProfile = await dbService.getAuthorProfileByUserId(user.id);
    if (!existingProfile) {
      return NextResponse.json(
        { message: "Author profile not found" },
        { status: 404 }
      );
    }

    // Update author profile
    const success = await dbService.updateAuthorProfile(user.id, {
      ...(preNominals !== undefined && { preNominals }),
      ...(middleInitials !== undefined && { middleInitials }),
      ...(countryOfResidence && { countryOfResidence }),
      ...(bio && { bio }),
      ...(links && { links }),
      ...(imageUrl && { imageUrl }),
    });

    if (!success) {
      return NextResponse.json(
        { message: "Failed to update author profile" },
        { status: 500 }
      );
    }

    // Create job for admin notification
    await dbService.createJob({
      adminNo: `PROF-${Date.now().toString().slice(-6)}`,
      type: JobType.PROFILE_UPDATE,
      status: JobStatus.PENDING,
      userId: user.id,
      relatedId: existingProfile._id,
    });

    const updatedProfile = await dbService.getAuthorProfileByUserId(user.id);
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating author profile:", error);
    return NextResponse.json(
      { message: "Failed to update author profile" },
      { status: 500 }
    );
  }
}
