import { type NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, hasRole } from "@/lib/auth-utils";
import { UserRole } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(req);

    // Check if user is super admin
    if (!user || !hasRole(user, UserRole.SUPER_ADMIN)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Get user by ID
    const db = await (await import("@/lib/mongodb")).default;
    const targetUser = await db
      .db()
      .collection("users")
      .findOne({ _id: new ObjectId(params.id) });

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Remove sensitive information
    const { password, ...userWithoutPassword } = targetUser;

    // Get author profile if user is an author
    let authorProfile = null;
    if (targetUser.isAuthor) {
      authorProfile = await db
        .db()
        .collection("author_profiles")
        .findOne({ userId: new ObjectId(params.id) });
    }

    return NextResponse.json({
      user: userWithoutPassword,
      authorProfile,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(req);

    // Check if user is super admin
    if (!user || !hasRole(user, UserRole.SUPER_ADMIN)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { role, isAuthor } = await req.json();

    // Validate input
    if (!role && isAuthor === undefined) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }

    // Validate role
    if (role && !Object.values(UserRole).includes(role as UserRole)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // Get user by ID
    const db = await (await import("@/lib/mongodb")).default;
    const targetUser = await db
      .db()
      .collection("users")
      .findOne({ _id: new ObjectId(params.id) });

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update user
    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (role) {
      updateFields.role = role;
    }

    if (isAuthor !== undefined) {
      updateFields.isAuthor = isAuthor;
    }

    const result = await db
      .db()
      .collection("users")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: updateFields });

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "No changes made" }, { status: 304 });
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}
