"use client";

import type React from "react";

import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Upload, X, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";

const formSchema = z.object({
  preNominals: z.string().optional(),
  middleInitials: z.string().optional(),
  countryOfResidence: z.string().min(1, "Country of residence is required"),
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  links: z.array(z.string().url("Please enter a valid URL")).optional(),
});

export default function AuthorProfileForm() {
  const { fetchProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [links, setLinks] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preNominals: "",
      middleInitials: "",
      countryOfResidence: "",
      name: "",
      bio: "",
      links: [],
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setImageFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file immediately
    await handleFileUpload(file);
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress (since fetch doesn't provide progress events)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      // Upload the file
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const data = await response.json();

      // Store the URL for form submission
      setImagePreview(data.url);

      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
      console.error("Error uploading image:", error);
      // Reset the file input and preview on error
      removeImage();
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000); // Reset progress after a delay
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      // Submit author profile with image URL
      const response = await fetch("/api/author-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          links,
          imageUrl: imagePreview,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create author profile");
      }

      toast.success("Author profile submitted for approval");
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || "Failed to create author profile");
      console.error("Error creating author profile:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function addLink() {
    setLinks([...links, ""]);
  }

  function updateLink(index: number, value: string) {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  }

  function removeLink(index: number) {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Create Author Profile</h2>

      <Form>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField
              control={form.control}
              name="preNominals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pre-Nominals</FormLabel>
                  <div className="relative">
                    <select
                      className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3 appearance-none"
                      {...field}
                    >
                      <option value="">Please Select</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="middleInitials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Initials</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Input Text Here"
                      className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your full name"
                    className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="countryOfResidence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country Of Residence</FormLabel>
                <div className="relative">
                  <select
                    className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3 appearance-none"
                    {...field}
                  >
                    <option value="">Please Select</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Your Bio</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Input Text Here"
                    className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3 min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Add Links Relevant To Your Profile</FormLabel>
            {links.map((link, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="https://example.com"
                  className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3"
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeLink(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLink}
              disabled={links.length >= 3}
              className="mt-2"
            >
              Add Link
            </Button>
            {links.length >= 3 && (
              <p className="text-sm text-gray-500 mt-1">
                Maximum of 3 links allowed
              </p>
            )}
          </div>

          <div>
            <FormLabel>Upload Your Image</FormLabel>
            <div className="space-y-4">
              {/* Image preview */}
              {imagePreview && (
                <div className="relative w-full max-w-md mx-auto">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Profile preview"
                    width={200}
                    height={200}
                    className="mx-auto rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Image upload button */}
              {!imagePreview && (
                <div
                  className="flex flex-col items-center gap-3 bg-[#f3f2f2] border-2 border-dashed border-gray-300 rounded-md px-4 py-6 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">
                      Upload Your Image
                    </p>
                    <p className="text-xs text-gray-500">
                      Browse And Choose The Files You Want To Upload From Your
                      Computer
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    disabled={isUploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Browse Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isUploading}
                  />
                </div>
              )}

              {/* Upload progress */}
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Maximum file size: 5MB. Supported formats: JPG, PNG, GIF.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-black text-white rounded-md"
              disabled={isLoading || isUploading}
            >
              {isLoading ? "Submitting..." : "Submit Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
