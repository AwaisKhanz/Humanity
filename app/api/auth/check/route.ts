// app/api/auth/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getTokenFromRequest, verifyToken } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await dbService.getUserById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user._id?.toString(),
        email: user.email,
        role: user.role,
        isAuthor: user.isAuthor,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
