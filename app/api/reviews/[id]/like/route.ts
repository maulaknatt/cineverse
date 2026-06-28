import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-sync";

interface LikeParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: LikeParams) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: reviewId } = await params;

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Try finding existing like to avoid duplicate increment
    const existingLike = await prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId: user.id,
          reviewId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({ success: true, likesCount: review.likesCount });
    }

    // Create like entry
    await prisma.reviewLike.create({
      data: {
        userId: user.id,
        reviewId,
      },
    });

    // Update review likes count
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        likesCount: { increment: 1 },
      },
    });

    // Trigger notification for the review author (if it's not the same user)
    if (review.userId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: review.userId,
          type: "REVIEW_LIKED",
          data: {
            title: "Review Liked",
            description: `${user.name || user.username} liked your review!`,
            likerName: user.name || user.username,
            likerUsername: user.username,
            reviewId: review.id,
            tmdbId: review.tmdbId,
            mediaType: review.mediaType,
          },
        },
      });
    }

    return NextResponse.json({ success: true, likesCount: updatedReview.likesCount });
  } catch (error) {
    console.error("POST Review Like error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: LikeParams) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: reviewId } = await params;

    // Check if like exists
    const existingLike = await prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId: user.id,
          reviewId,
        },
      },
    });

    if (!existingLike) {
      return NextResponse.json({ error: "Like not found" }, { status: 400 });
    }

    // Remove like entry
    await prisma.reviewLike.delete({
      where: {
        userId_reviewId: {
          userId: user.id,
          reviewId,
        },
      },
    });

    // Update review likes count
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        likesCount: { decrement: 1 },
      },
    });

    return NextResponse.json({ success: true, likesCount: updatedReview.likesCount });
  } catch (error) {
    console.error("DELETE Review Like error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
