import { put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, hasRole } from "@/lib/auth-utils";
import { UserRole } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if user is authenticated and has admin role
    const user = getUserFromRequest(request);
    if (!user || !hasRole(user, [UserRole.ADMIN, UserRole.SUPER_ADMIN])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const filename = formData.get("filename") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
