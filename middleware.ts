import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getUserFromRequest, hasRole } from "./lib/auth-utils"
import { UserRole } from "./lib/db-service"

export function middleware(request: NextRequest) {
  const user = getUserFromRequest(request)
  const path = request.nextUrl.pathname

  // Admin routes protection
  if (path.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", encodeURIComponent(path))
      return NextResponse.redirect(loginUrl)
    }

    // Super admin routes
    if (path.startsWith("/admin/questions") && !hasRole(user, UserRole.SUPER_ADMIN)) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    // Admin routes - both admin and super admin can access
    if (!hasRole(user, [UserRole.ADMIN, UserRole.SUPER_ADMIN])) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
