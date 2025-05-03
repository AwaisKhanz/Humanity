import { jwtVerify } from "jose";

// This function works in the Edge Runtime
export async function verifyJWT(token: string): Promise<any> {
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("Edge token verification error:", error);
    return null;
  }
}
