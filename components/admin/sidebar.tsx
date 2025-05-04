"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, FileQuestion, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/lib/types"; // Import from types.ts instead of db-service.ts
import { cn } from "@/lib/utils";
import { BarChart3, LayoutDashboard } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Jobs",
      href: "/admin/jobs",
      icon: BarChart3,
    },
    {
      title: "Questions",
      href: "/admin/questions",
      icon: FileQuestion,
      superAdminOnly: true,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      superAdminOnly: true,
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Link href="/" className="text-xl font-bold">
          humanity_
        </Link>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded">Admin</span>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          // Skip items that are for super admins only if the user is not a super admin
          if (item.superAdminOnly && !isSuperAdmin) {
            return null;
          }

          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 w-56">
        <div className="border-t border-gray-800 pt-4 mt-4">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-400 hover:text-white hover:bg-gray-800 w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-400 hover:text-white hover:bg-gray-800 mt-1"
          >
            <Home className="h-5 w-5" />
            <span>Back to Site</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
