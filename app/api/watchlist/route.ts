import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";
import { MediaType, WatchlistStatus } from "@prisma/client";
import { awardXp } from "@/lib/xp";

export async function POST(request: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tmdbId, mediaType, status = WatchlistStatus.PLAN_TO_WATCH } = await request.json();

    if (!tmdbId || !mediaType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const targetStatus = status as WatchlistStatus;

    // Check if the item already exists to see if the status changed to COMPLETED
    const existingItem = await prisma.watchlistItem.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId: user.id,
          tmdbId: Number(tmdbId),
          mediaType: mediaType as MediaType,
        },
      },
    });

    const isNewlyCompleted = targetStatus === WatchlistStatus.COMPLETED && existingItem?.status !== WatchlistStatus.COMPLETED;

    const watchlistItem = await prisma.watchlistItem.upsert({
      where: {
        userId_tmdbId_mediaType: {
          userId: user.id,
          tmdbId: Number(tmdbId),
          mediaType: mediaType as MediaType,
        },
      },
      update: {
        status: targetStatus,
      },
      create: {
        userId: user.id,
        tmdbId: Number(tmdbId),
        mediaType: mediaType as MediaType,
        status: targetStatus,
      },
    });

    let xpResult = null;

    if (isNewlyCompleted) {
      // 1. Record to Watch History
      await prisma.watchHistory.create({
        data: {
          userId: user.id,
          tmdbId: Number(tmdbId),
          mediaType: mediaType as MediaType,
        },
      });

      // 2. Award XP
      xpResult = await awardXp(user.id, 15);
    }

    return NextResponse.json({
      ...watchlistItem,
      xpGained: xpResult ? xpResult.xpGained : 0,
      leveledUp: xpResult ? xpResult.leveledUp : false,
      currentLevel: xpResult ? xpResult.level : user.level,
      currentXp: xpResult ? xpResult.xp : user.xp,
    });
  } catch (error) {
    console.error("Watchlist POST error:", error);
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

    await prisma.watchlistItem.delete({
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
    console.error("Watchlist DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
