"use client";

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
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      // Call the forgot password API
      await api.post("/auth/forgot-password", { email: values.email });
      toast.success("Password reset link has been sent to your email");
      setSubmitted(true);
    } catch (error: any) {
      const errorMessage = error || "Failed to send reset link";
      toast.error(errorMessage);
      form.setError("email", { message: errorMessage });
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
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
            <p className="text-muted-foreground">Forgot Password</p>
            <h2 className="text-2xl font-bold mt-2">Reset Your Password</h2>
          </div>

          {submitted ? (
            <div className="text-center">
              <div className="mb-4 p-2 bg-green-50 text-green-800 rounded-md">
                Password reset link has been sent to your email.
              </div>
              <p className="mb-4">
                Please check your inbox and follow the instructions to reset
                your password.
              </p>
              <Link href="/login">
                <Button className="w-full rounded-md py-6">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <Form>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <p className="mb-6 text-muted-foreground text-sm">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          className="py-2 bg-[#f1f5f9] border-0"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full rounded-md py-6 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          )}

          <div className="text-center mt-6">
            <p>
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-black hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
