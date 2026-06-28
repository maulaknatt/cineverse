import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-sync";

interface CommentLikeParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: CommentLikeParams) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: commentId } = await params;

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Try finding existing like
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({ success: true });
    }

    // Create like entry
    await prisma.commentLike.create({
      data: {
        userId: user.id,
        commentId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST Comment Like error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: CommentLikeParams) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: commentId } = await params;

    // Check if like exists
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId,
        },
      },
    });

    if (!existingLike) {
      return NextResponse.json({ error: "Like not found" }, { status: 400 });
    }

    // Remove like entry
    await prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Comment Like error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
