"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, Upload } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "@/contexts/auth-context"

const formSchema = z.object({
  preNominals: z.string().optional(),
  middleInitials: z.string().optional(),
  countryOfResidence: z.string().min(1, "Country of residence is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  links: z.array(z.string().url("Please enter a valid URL")).optional(),
  imageUrl: z.string().optional(),
})

export default function AuthorProfileForm() {
  const { fetchProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [links, setLinks] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preNominals: "",
      middleInitials: "",
      countryOfResidence: "",
      bio: "",
      links: [],
      imageUrl: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const response = await fetch("/api/author-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          links,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create author profile")
      }

      toast.success("Author profile submitted for approval")
      fetchProfile()
    } catch (error: any) {
      toast.error(error.message || "Failed to create author profile")
      console.error("Error creating author profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function addLink() {
    setLinks([...links, ""])
  }

  function updateLink(index: number, value: string) {
    const newLinks = [...links]
    newLinks[index] = value
    setLinks(newLinks)
  }

  function removeLink(index: number) {
    const newLinks = [...links]
    newLinks.splice(index, 1)
    setLinks(newLinks)
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
                    <select className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3 appearance-none" {...field}>
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
            name="countryOfResidence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country Of Residence</FormLabel>
                <div className="relative">
                  <select className="w-full bg-[#f3f2f2] border-0 rounded-md px-4 py-3 appearance-none" {...field}>
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
                <Button type="button" variant="outline" size="sm" onClick={() => removeLink(index)}>
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
            {links.length >= 3 && <p className="text-sm text-gray-500 mt-1">Maximum of 3 links allowed</p>}
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Your Image</FormLabel>
                <div className="flex items-center gap-3 bg-[#f3f2f2] border-0 rounded-md px-4 py-3">
                  <Upload className="h-5 w-5 text-gray-500" />
                  <div className="text-sm text-gray-500">
                    Browse And Choose The Files You
                    <br />
                    Want To Upload From Your Computer
                  </div>
                </div>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button type="submit" className="bg-black text-white rounded-md" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
