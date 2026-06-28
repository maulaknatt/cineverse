import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ isPro: false });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { isPro: true },
    });

    return NextResponse.json({ isPro: user?.isPro || false });
  } catch (error) {
    console.error("Pro status check error:", error);
    return NextResponse.json({ isPro: false });
  }
}
