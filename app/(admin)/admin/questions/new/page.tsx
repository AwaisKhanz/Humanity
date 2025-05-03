"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, Video, X } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserRole } from "@/lib/types";

const formSchema = z.object({
  number: z.number().min(1, "Question number must be at least 1"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
});

export default function NewQuestionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<"image" | "video" | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: undefined,
      title: "",
      description: "",
      imageUrl: "",
      videoUrl: "",
    },
  });

  if (!user || user.role !== UserRole.SUPER_ADMIN) {
    router.push("/admin");
    return null;
  }

  // Function to handle file upload
  const handleFileUpload = async (file: File, type: "image" | "video") => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadType(type);

      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      // Upload the file
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload file");
      }

      const data = await response.json();

      // Update the form with the file URL
      if (type === "image") {
        setValue("imageUrl", data.url);
        setImagePreview(data.url);
      } else {
        setValue("videoUrl", data.url);
        setVideoPreview(data.url);
      }

      toast.success(`${type} uploaded successfully`);
    } catch (error: any) {
      toast.error(error.message || `Failed to upload ${type}`);
      console.error(`Error uploading ${type}:`, error);
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
      setUploadType(null);
    }
  };

  // Function to handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, "image");
    }
  };

  // Function to handle video selection
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, "video");
    }
  };

  // Function to remove image
  const removeImage = () => {
    setValue("imageUrl", "");
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Function to remove video
  const removeVideo = () => {
    setValue("videoUrl", "");
    setVideoPreview(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create question");
      }

      toast.success("Question created successfully");
      router.push("/admin/questions");
    } catch (error: any) {
      toast.error(error.message || "Failed to create question");
      console.error("Error creating question:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-[#f3f2f2] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/admin/questions">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Questions
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Question</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Question Number
                </label>
                <input
                  type="number"
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2"
                  {...register("number", { valueAsNumber: true })}
                />
                {errors.number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.number.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 min-h-[150px]"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Hidden input for image URL */}
              <input type="hidden" {...register("imageUrl")} />

              {/* Hidden input for video URL */}
              <input type="hidden" {...register("videoUrl")} />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Image
                </label>
                <div className="space-y-4">
                  {/* Image preview */}
                  {imagePreview && (
                    <div className="relative w-full max-w-md">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-auto rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Image upload button */}
                  {!imagePreview && (
                    <div
                      className="flex items-center gap-3 bg-white border border-gray-300 rounded-md px-4 py-3 cursor-pointer"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <ImageIcon className="h-5 w-5 text-gray-500" />
                      <div className="text-sm text-gray-500">
                        Click to upload an image
                      </div>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                        disabled={isUploading}
                      />
                    </div>
                  )}

                  {/* Upload progress */}
                  {isUploading && uploadType === "image" && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Video
                </label>
                <div className="space-y-4">
                  {/* Video preview */}
                  {videoPreview && (
                    <div className="relative w-full max-w-md">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-auto rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Video upload button */}
                  {!videoPreview && (
                    <div
                      className="flex items-center gap-3 bg-white border border-gray-300 rounded-md px-4 py-3 cursor-pointer"
                      onClick={() => videoInputRef.current?.click()}
                    >
                      <Video className="h-5 w-5 text-gray-500" />
                      <div className="text-sm text-gray-500">
                        Click to upload a video
                      </div>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoSelect}
                        disabled={isUploading}
                      />
                    </div>
                  )}

                  {/* Upload progress */}
                  {isUploading && uploadType === "video" && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-black text-white"
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting ? "Creating..." : "Create Question"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
