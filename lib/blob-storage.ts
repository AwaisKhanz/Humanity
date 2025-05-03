import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

// Function to upload an image to Vercel Blob Storage
export async function uploadImage(file: File): Promise<string> {
  try {
    // Generate a unique filename
    const filename = `${nanoid()}-${file.name}`;

    // Upload the file to Vercel Blob Storage
    const blob = await put(filename, file, {
      access: "public", // Make the file publicly accessible
    });

    // Return the URL of the uploaded file
    return blob.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

// Function to upload a video to Vercel Blob Storage
export async function uploadVideo(file: File): Promise<string> {
  try {
    // Generate a unique filename
    const filename = `${nanoid()}-${file.name}`;

    // Upload the file to Vercel Blob Storage
    const blob = await put(filename, file, {
      access: "public", // Make the file publicly accessible
    });

    // Return the URL of the uploaded file
    return blob.url;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw new Error("Failed to upload video");
  }
}
