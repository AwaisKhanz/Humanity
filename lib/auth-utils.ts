import type { NextApiRequest } from "next";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { User, UserRole } from "./db-service";

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

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Extract token from request
export function getTokenFromRequest(
  req: NextApiRequest | NextRequest
): string | null {
  // For API routes
  if ("headers" in req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    // Check cookies
    const cookies = req.cookies as { token?: string };
    if (cookies && cookies.token) {
      return cookies.token;
    }
  }
  // For middleware
  else if ("cookies" in req) {
    const token = req.cookies.get("token")?.value;
    if (token) {
      return token;
    }
  }

  return null;
}

// Get user from request
export function getUserFromRequest(req: NextApiRequest | NextRequest): any {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  return verifyToken(token);
}

// Check if user has required role
export function hasRole(user: any, roles: UserRole | UserRole[]): boolean {
  if (!user) return false;

  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  return requiredRoles.includes(user.role);
}
