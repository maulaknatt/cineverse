import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-sync";

interface FollowParams {
  params: Promise<{ username: string }>;
}

export async function POST(request: NextRequest, { params }: FollowParams) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await params;

    // Find the user to follow
    const targetUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.id === user.id) {
      return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
    }

    // Try finding existing follow relations to prevent duplicates
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUser.id,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json({ success: true });
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: targetUser.id,
      },
    });

    // Trigger notification for the followed user
    await prisma.notification.create({
      data: {
        userId: targetUser.id,
        type: "FRIEND_FOLLOWED",
        data: {
          title: "New Follower",
          description: `${user.name || user.username} started following you!`,
          followerName: user.name || user.username,
          followerUsername: user.username,
        },
      },
    });

    return NextResponse.json({ success: true, follow });
  } catch (error) {
    console.error("POST Follow error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: FollowParams) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await params;

    // Find the user to unfollow
    const targetUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if relationship exists
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUser.id,
        },
      },
    });

    if (!existingFollow) {
      return NextResponse.json({ error: "Follow relationship not found" }, { status: 400 });
    }

    // Delete follow relationship
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUser.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Follow error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
