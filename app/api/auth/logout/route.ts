import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Clear the token cookie
  (await cookies()).set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return NextResponse.json({ message: "Logged out successfully" });
}
