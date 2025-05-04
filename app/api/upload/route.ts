import { type NextRequest, NextResponse } from "next/server";
import { uploadImage, uploadVideo } from "@/lib/blob-storage";
import { getUserFromRequest } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated (any user, not just admin)
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the form data from the request
    const formData = await req.formData();

    // Get the file from the form data
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!type || (type !== "image" && type !== "video")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Upload the file based on its type
    let url: string;
    if (type === "image") {
      url = await uploadImage(file);
    } else {
      url = await uploadVideo(file);
    }

    // Return the URL of the uploaded file
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error handling file upload:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
