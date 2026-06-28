import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-sync";
import { MediaType } from "@prisma/client";
import { awardXp } from "@/lib/xp";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tmdbId = searchParams.get("tmdbId");
    const mediaType = searchParams.get("mediaType");

    if (!tmdbId || !mediaType) {
      return NextResponse.json({ error: "Missing tmdbId or mediaType" }, { status: 400 });
    }

    // Check current user if logged in to see if they liked each review
    const { userId: clerkId } = await auth();
    let dbUserId: string | null = null;
    if (clerkId) {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId },
        select: { id: true },
      });
      dbUserId = dbUser?.id || null;
    }

    const reviews = await prisma.review.findMany({
      where: {
        tmdbId: Number(tmdbId),
        mediaType: mediaType as MediaType,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            level: true,
          },
        },
        likes: {
          where: dbUserId ? { userId: dbUserId } : { userId: "none" },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedReviews = reviews.map((r) => ({
      ...r,
      isLiked: r.likes.length > 0,
      likes: undefined,
      commentsCount: r._count.comments,
      _count: undefined,
    }));

    return NextResponse.json({ reviews: formattedReviews });
  } catch (error) {
    console.error("GET Reviews error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tmdbId, mediaType, rating, content, hasSpoiler = false } = await request.json();

    if (!tmdbId || !mediaType || rating === undefined || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const targetRating = Number(rating);
    if (targetRating < 0.5 || targetRating > 5.0) {
      return NextResponse.json({ error: "Rating must be between 0.5 and 5.0" }, { status: 400 });
    }

    // Check if review already exists to avoid duplicate XP
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId: user.id,
          tmdbId: Number(tmdbId),
          mediaType: mediaType as MediaType,
        },
      },
    });

    const review = await prisma.review.upsert({
      where: {
        userId_tmdbId_mediaType: {
          userId: user.id,
          tmdbId: Number(tmdbId),
          mediaType: mediaType as MediaType,
        },
      },
      update: {
        rating: targetRating,
        content,
        hasSpoiler,
      },
      create: {
        userId: user.id,
        tmdbId: Number(tmdbId),
        mediaType: mediaType as MediaType,
        rating: targetRating,
        content,
        hasSpoiler,
      },
    });

    let xpResult = null;
    if (!existingReview) {
      // Award 25 XP for writing a new review
      xpResult = await awardXp(user.id, 25);
    }

    return NextResponse.json({
      review,
      xpGained: xpResult ? xpResult.xpGained : 0,
      leveledUp: xpResult ? xpResult.leveledUp : false,
      currentLevel: xpResult ? xpResult.level : user.level,
      currentXp: xpResult ? xpResult.xp : user.xp,
    });
  } catch (error) {
    console.error("POST Review error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tmdbId, mediaType } = await request.json();

    if (!tmdbId || !mediaType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.review.delete({
      where: {
        userId_tmdbId_mediaType: {
          userId: user.id,
          tmdbId: Number(tmdbId),
          mediaType: mediaType as MediaType,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Review error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
