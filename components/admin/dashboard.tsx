"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/lib/types"; // Import from types.ts
import type { Job } from "@/lib/types";
import { JobListClient } from "./job-list";

interface DashboardClientProps {
  jobs: Job[];
}

export function DashboardClient({ jobs }: DashboardClientProps) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  console.log(jobs);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Pending Jobs"
          description="Review and approve author applications and answer submissions"
          href="/admin/jobs"
          value="View Jobs"
        />

        {isSuperAdmin && (
          <>
            <DashboardCard
              title="Questions"
              description="Manage questions and create new ones"
              href="/admin/questions"
              value="Manage Questions"
            />

            <DashboardCard
              title="Users"
              description="View and manage user accounts"
              href="/admin/users"
              value="Manage Users"
            />
          </>
        )}
      </div>

      <div className="mt-8">
        <div className=" flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold mb-4">Recent Jobs</h2>
          <div className=" text-right">
            <Link href="/admin/jobs" className="text-blue-600 hover:underline">
              View all jobs →
            </Link>
          </div>
        </div>
        <JobListClient jobs={jobs} />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
  value,
}: {
  title: string;
  description: string;
  href: string;
  value: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href={href}
          className="inline-block px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          {value}
        </Link>
      </CardContent>
    </Card>
  );
}
