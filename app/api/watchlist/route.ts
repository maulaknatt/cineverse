import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";
import { MediaType, WatchlistStatus } from "@prisma/client";

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

    const watchlistItem = await prisma.watchlistItem.upsert({
      where: {
        userId_tmdbId_mediaType: {
          userId: user.id,
          tmdbId: Number(tmdbId),
          mediaType: mediaType as MediaType,
        },
      },
      update: {
        status: status as WatchlistStatus,
      },
      create: {
        userId: user.id,
        tmdbId: Number(tmdbId),
        mediaType: mediaType as MediaType,
        status: status as WatchlistStatus,
      },
    });

    return NextResponse.json(watchlistItem);
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
