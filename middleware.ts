import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/edge-auth";
import { UserRole } from "./lib/types";

// Helper function to check if user has required role
function hasRole(user: any, roles: UserRole | UserRole[]): boolean {
  if (!user) return false;
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  return requiredRoles.includes(user.role);
}

export async function middleware(request: NextRequest) {
  // Get token directly from cookies
  const token = request.cookies.get("token")?.value;

  console.log("Token in middleware:", token ? "Found" : "Not found");

  // Verify token and get user - using edge-compatible function
  const user = token ? await verifyJWT(token) : null;

  console.log("User in middleware:", user ? JSON.stringify(user) : "null");

  const path = request.nextUrl.pathname;

  // Admin routes protection
  if (path.startsWith("/admin")) {
    if (!user) {
      console.log("No user found, redirecting to login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", encodeURIComponent(path));
      return NextResponse.redirect(loginUrl);
    }

    // Super admin routes
    if (
      path.startsWith("/admin/questions") &&
      !hasRole(user, UserRole.SUPER_ADMIN)
    ) {
      console.log("Not a super admin, redirecting to admin");
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Admin routes - both admin and super admin can access
    if (!hasRole(user, [UserRole.ADMIN, UserRole.SUPER_ADMIN])) {
      console.log("Not an admin or super admin, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log("Access granted to admin route");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
