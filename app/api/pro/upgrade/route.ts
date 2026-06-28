import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Update user to PRO status
    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: { isPro: true },
    });

    return NextResponse.json({
      success: true,
      message: "Congratulations! Your account has been upgraded to PRO.",
      isPro: updatedUser.isPro,
    });
  } catch (error) {
    console.error("Pro upgrade API error:", error);
    return NextResponse.json(
      { error: "Failed to upgrade to PRO" },
      { status: 500 }
    );
  }
}
