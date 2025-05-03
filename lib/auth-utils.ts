import type { NextApiRequest } from "next";
import type { NextRequest } from "next/server";
import type { IncomingHttpHeaders } from "http";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { User, UserRole } from "./types";

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRY = "7d";

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: Partial<User>): string {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    isAuthor: user.isAuthor,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

// Verify JWT token - only use this in server components or API routes, not in middleware
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// Type guard for NextApiRequest
function isNextApiRequest(
  req: NextApiRequest | NextRequest
): req is NextApiRequest {
  return "query" in req;
}

// Type guard for IncomingHttpHeaders
function isIncomingHttpHeaders(headers: any): headers is IncomingHttpHeaders {
  return headers && typeof headers === "object" && !("get" in headers);
}

// Extract token from request - fixed version with proper type guards
export function getTokenFromRequest(
  req: NextApiRequest | NextRequest
): string | null {
  // For API routes (NextApiRequest)
  if (isNextApiRequest(req)) {
    // Check authorization header for NextApiRequest
    if (
      isIncomingHttpHeaders(req.headers) &&
      typeof req.headers.authorization === "string"
    ) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        return authHeader.substring(7);
      }
    }

    // Check cookies for NextApiRequest
    if (
      req.cookies &&
      typeof req.cookies === "object" &&
      "token" in req.cookies
    ) {
      return req.cookies.token as string;
    }
  }
  // For middleware (NextRequest)
  else {
    // Check cookies for NextRequest
    try {
      const token = req.cookies.get("token")?.value;
      if (token) {
        return token;
      }
    } catch (e) {
      console.error("Error accessing cookies:", e);
    }

    // Check authorization header for NextRequest
    try {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.substring(7);
      }
    } catch (e) {
      console.error("Error accessing headers:", e);
    }
  }

  return null;
}

// Get user from request - only use this in server components or API routes, not in middleware
export function getUserFromRequest(req: NextApiRequest | NextRequest): any {
  const token = getTokenFromRequest(req);

  if (!token) {
    console.log("No token found in request");
    return null;
  }

  const user = verifyToken(token);
  console.log("User from token:", user ? "Found" : "Invalid token");
  return user;
}

// Check if user has required role
export function hasRole(user: any, roles: UserRole | UserRole[]): boolean {
  if (!user) return false;

  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  return requiredRoles.includes(user.role);
}
