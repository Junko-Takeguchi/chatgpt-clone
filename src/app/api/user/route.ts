import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const clerkId = body?.clerkId;

    if (!clerkId || typeof clerkId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid clerkId" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ mongodbId: user.id });
  } catch (err) {
    console.error("POST /api/user error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
