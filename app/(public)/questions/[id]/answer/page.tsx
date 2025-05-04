"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().optional(),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(100, "Summary cannot exceed 100 characters"),
  content: z
    .string()
    .min(50, "Content must be at least 50 characters")
    .max(5000, "Content cannot exceed 5000 characters"),
  link1: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  link2: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export default function AnswerForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();

  // Image upload states
  const [imageUrl1, setImageUrl1] = useState<string | null>(null);
  const [imageUrl2, setImageUrl2] = useState<string | null>(null);
  const [isUploading1, setIsUploading1] = useState(false);
  const [isUploading2, setIsUploading2] = useState(false);
  const [uploadProgress1, setUploadProgress1] = useState(0);
  const [uploadProgress2, setUploadProgress2] = useState(0);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      link1: "",
      link2: "",
    },
  });

  const summaryText = watch("summary") || "";
  const mainText = watch("content") || "";

  useEffect(() => {
    async function fetchQuestion() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/questions/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch question");
        }

        const data = await response.json();
        setQuestion(data);
      } catch (error) {
        console.error("Error fetching question:", error);
        toast.error("Failed to fetch question");
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestion();
  }, [params.id]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    imageNumber: 1 | 2
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Upload the file
    await handleFileUpload(file, imageNumber);
  };

  const handleFileUpload = async (file: File, imageNumber: 1 | 2) => {
    const setIsUploading =
      imageNumber === 1 ? setIsUploading1 : setIsUploading2;
    const setUploadProgress =
      imageNumber === 1 ? setUploadProgress1 : setUploadProgress2;
    const setImageUrl = imageNumber === 1 ? setImageUrl1 : setImageUrl2;

    setIsUploading(true);

    // Simulate progress (since fetch doesn't provide progress events)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 300);

    try {
      // Upload the file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setImageUrl(data.url);

      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const removeImage = (imageNumber: 1 | 2) => {
    if (imageNumber === 1) {
      setImageUrl1(null);
      if (fileInputRef1.current) {
        fileInputRef1.current.value = "";
      }
    } else {
      setImageUrl2(null);
      if (fileInputRef2.current) {
        fileInputRef2.current.value = "";
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error("You must be logged in to submit an answer");
      router.push(`/login?redirect=/questions/${params.id}/answer`);
      return;
    }

    if (!user.isAuthor) {
      toast.error("You must be an approved author to submit answers");
      router.push("/become-author");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/questions/${params.id}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          summary: values.summary,
          content: values.content,
          links: [values.link1, values.link2].filter(Boolean),
          imageUrl1,
          imageUrl2,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit answer");
      }

      toast.success("Your answer has been submitted for approval");
      router.push(`/questions/${params.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit answer");
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-[#f3f2f2]">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-6 text-center">
            <p>Loading question...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#f3f2f2]">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="mb-4">You must be logged in to submit an answer.</p>
            <Link href={`/login?redirect=/questions/${params.id}/answer`}>
              <Button className="rounded-full">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user.isAuthor) {
    return (
      <div className="bg-[#f3f2f2]">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Author Status Required</h2>
            <p className="mb-4">
              You must be an approved author to submit answers.
            </p>
            <Link href="/become-author">
              <Button className="rounded-full">Become an Author</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f2f2]">
      <div className="container mx-auto px-4 py-8">
        {/* First Form Section */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex justify-center mb-4">
            <Button className="bg-black text-white rounded-md font-medium">
              SUBMIT YOUR ANSWER HERE
            </Button>
          </div>

          <p className="text-gray-700 mb-4">
            Thank you for contributing to our community. Your answer will be
            reviewed by our administrators before being published. Please ensure
            your answer is thoughtful, respectful, and relevant to the question.
          </p>

          <p className="text-gray-700">
            Once approved, your answer will be visible to all users and can
            receive likes from the community.
          </p>
        </div>

        {/* Detailed Answer Form */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Submit Answer Here</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Selected Question
              </label>
              <div className="bg-[#f3f2f2] border-0 rounded-md px-4 py-3">
                {question ? (
                  <div>
                    <span className="font-bold">
                      Question {question.number}:
                    </span>{" "}
                    {question.title}
                  </div>
                ) : (
                  "Loading question..."
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Input Text Here"
                  className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3"
                  {...register("title")}
                />
                <div className="mt-1 text-xs text-gray-500">
                  You can add a title but it's optional
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Add Link 1 (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3"
                    {...register("link1")}
                  />
                  {errors.link1 && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.link1.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Add Link 2 (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3"
                    {...register("link2")}
                  />
                  {errors.link2 && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.link2.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Summary
                </label>
                <div className="relative">
                  <textarea
                    placeholder="Input Text Here"
                    className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3 min-h-[100px]"
                    {...register("summary")}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {summaryText.length}/100
                  </div>
                </div>
                {errors.summary && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.summary.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Add Image 1 Here (Optional)
                  </label>
                  {imageUrl1 ? (
                    <div className="relative">
                      <Image
                        src={imageUrl1 || "/placeholder.svg"}
                        alt="Image 1"
                        width={200}
                        height={150}
                        className="mx-auto rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(1)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        aria-label="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center gap-3 bg-[#f3f2f2] border-2 border-dashed border-gray-300 rounded-md px-4 py-6 cursor-pointer"
                      onClick={() => fileInputRef1.current?.click()}
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                          Upload Your Image
                        </p>
                        <p className="text-xs text-gray-500">
                          Browse And Choose The Files You Want To Upload From
                          Your Computer
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        disabled={isUploading1}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Browse Files
                      </Button>
                      <input
                        ref={fileInputRef1}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 1)}
                        disabled={isUploading1}
                      />
                    </div>
                  )}
                  {isUploading1 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress1}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-center mt-1">
                        {uploadProgress1 < 100
                          ? "Uploading..."
                          : "Upload complete!"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Add Image 2 Here (Optional)
                  </label>
                  {imageUrl2 ? (
                    <div className="relative">
                      <Image
                        src={imageUrl2 || "/placeholder.svg"}
                        alt="Image 2"
                        width={200}
                        height={150}
                        className="mx-auto rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(2)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        aria-label="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center gap-3 bg-[#f3f2f2] border-2 border-dashed border-gray-300 rounded-md px-4 py-6 cursor-pointer"
                      onClick={() => fileInputRef2.current?.click()}
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                          Upload Your Image
                        </p>
                        <p className="text-xs text-gray-500">
                          Browse And Choose The Files You Want To Upload From
                          Your Computer
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        disabled={isUploading2}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Browse Files
                      </Button>
                      <input
                        ref={fileInputRef2}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 2)}
                        disabled={isUploading2}
                      />
                    </div>
                  )}
                  {isUploading2 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress2}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-center mt-1">
                        {uploadProgress2 < 100
                          ? "Uploading..."
                          : "Upload complete!"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Main Text
              </label>
              <div className="relative">
                <textarea
                  placeholder="Input Text Here"
                  className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3 min-h-[150px]"
                  {...register("content")}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {mainText.length}/5000
                </div>
              </div>
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-black text-white rounded-md px-8"
                disabled={isSubmitting || isUploading1 || isUploading2}
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
