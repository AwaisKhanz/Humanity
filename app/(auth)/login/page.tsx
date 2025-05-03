"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")
  const registered = searchParams.get("registered")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (registered === "true") {
      toast.success("Registration successful! Please login.")
    }
  }, [registered])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const redirectUrl = redirect ? decodeURIComponent(redirect) : null
      await login(values.email, values.password, redirectUrl)
    } catch (error: any) {
      form.setError("password", {
        message: error.message || "Invalid email or password",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f2f2] p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <h1 className="text-2xl font-bold">humanity_</h1>
            </Link>
            <p className="text-muted-foreground">Welcome Back!</p>
            <h2 className="text-2xl font-bold mt-2">Login To Your Account</h2>
          </div>

          <Form>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} className="py-2 bg-[#f1f5f9] border-0" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="py-2 bg-[#f1f5f9] border-0"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm font-medium">
                    Keep Me Signed In
                  </label>
                </div>
                <Link href="/forgot-password" className="text-sm font-medium hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" className="w-full rounded-md py-6" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <p>
              Don't Have An Account?{" "}
              <Link href="/register" className="font-medium text-black hover:underline">
                Create An Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
