import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-sync";
import { awardXp } from "@/lib/xp";
import { auth } from "@clerk/nextjs/server";

interface CommentsParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: CommentsParams) {
  try {
    const { id: reviewId } = await params;

    // Check current user if logged in to see if they liked each comment
    const { userId: clerkId } = await auth();
    let dbUserId: string | null = null;
    if (clerkId) {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId },
        select: { id: true },
      });
      dbUserId = dbUser?.id || null;
    }

    const comments = await prisma.comment.findMany({
      where: { reviewId },
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
          select: { likes: true },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const formattedComments = comments.map((c) => ({
      ...c,
      isLiked: c.likes.length > 0,
      likes: undefined,
      likesCount: c._count.likes,
      _count: undefined,
    }));

    return NextResponse.json({ comments: formattedComments });
  } catch (error) {
    console.error("GET Comments error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: CommentsParams) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: reviewId } = await params;
    const { content, parentId } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true, tmdbId: true, mediaType: true },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        reviewId,
        content,
        parentId: parentId || null,
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
      },
    });

    // Award +5 XP for commenting
    const xpResult = await awardXp(user.id, 5);

    // Trigger notification for the review author (if it's not the same user)
    if (review.userId !== user.id && !parentId) {
      await prisma.notification.create({
        data: {
          userId: review.userId,
          type: "COMMENT_REPLIED",
          data: {
            title: "New Comment on Review",
            description: `${user.name || user.username} commented on your review!`,
            commenterName: user.name || user.username,
            commenterUsername: user.username,
            reviewId,
            commentId: comment.id,
            tmdbId: review.tmdbId,
            mediaType: review.mediaType,
          },
        },
      });
    }

    // Trigger notification if replying to another comment
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { userId: true },
      });

      if (parentComment && parentComment.userId !== user.id) {
        await prisma.notification.create({
          data: {
            userId: parentComment.userId,
            type: "COMMENT_REPLIED",
            data: {
              title: "Reply received",
              description: `${user.name || user.username} replied to your comment!`,
              commenterName: user.name || user.username,
              commenterUsername: user.username,
              reviewId,
              commentId: comment.id,
              tmdbId: review.tmdbId,
              mediaType: review.mediaType,
            },
          },
        });
      }
    }

    return NextResponse.json({
      comment,
      xpGained: xpResult ? xpResult.xpGained : 0,
      leveledUp: xpResult ? xpResult.leveledUp : false,
      currentLevel: xpResult ? xpResult.level : user.level,
      currentXp: xpResult ? xpResult.xp : user.xp,
    });
  } catch (error) {
    console.error("POST Comment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
