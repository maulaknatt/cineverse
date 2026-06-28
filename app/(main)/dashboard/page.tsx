import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";
import { getMovieDetail } from "@/services/tmdb/movies";
import { getTVDetail } from "@/services/tmdb/tv";
import { DashboardView } from "@/components/common/dashboard-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Profile",
  description: "Manage your movie watchlist, favorites, level, and personal recommendations.",
};

// Force dynamic because user data is dynamic
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getOrCreateUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/dashboard");
  }

  // Fetch watchlist, favorites, review count, and watch history from DB
  const [dbWatchlist, dbFavorites, reviewCount, watchHistory] = await Promise.all([
    prisma.watchlistItem.findMany({
      where: { userId: user.id },
      orderBy: { addedAt: "desc" },
    }),
    prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { addedAt: "desc" },
    }),
    prisma.review.count({
      where: { userId: user.id },
    }),
    prisma.watchHistory.findMany({
      where: { userId: user.id },
      select: { watchedAt: true },
      orderBy: { watchedAt: "desc" },
    }),
  ]);

  // Fetch details from TMDB in parallel
  const watchlist = await Promise.all(
    dbWatchlist.map(async (item) => {
      try {
        const details = item.mediaType === "movie" 
          ? await getMovieDetail(item.tmdbId) 
          : await getTVDetail(item.tmdbId);
        return {
          id: item.id,
          mediaType: item.mediaType,
          status: item.status,
          details,
        };
      } catch (err) {
        console.error(`Failed to fetch TMDB details for watchlist item ${item.tmdbId}:`, err);
        return null;
      }
    })
  ).then((res) => res.filter((x): x is Exclude<typeof x, null> => x !== null));

  const favorites = await Promise.all(
    dbFavorites.map(async (item) => {
      try {
        const details = item.mediaType === "movie" 
          ? await getMovieDetail(item.tmdbId) 
          : await getTVDetail(item.tmdbId);
        return {
          id: item.id,
          mediaType: item.mediaType,
          details,
        };
      } catch (err) {
        console.error(`Failed to fetch TMDB details for favorite item ${item.tmdbId}:`, err);
        return null;
      }
    })
  ).then((res) => res.filter((x): x is Exclude<typeof x, null> => x !== null));

  // ------------------------------------------
  // Process Analytics (Tahap 5)
  // ------------------------------------------
  const completedItems = watchlist.filter((item) => item.status === "COMPLETED");

  // 1. Favorite Genres
  const genreCounts: Record<string, number> = {};
  completedItems.forEach((item) => {
    const genres = item.details?.genres || [];
    genres.forEach((g: any) => {
      genreCounts[g.name] = (genreCounts[g.name] || 0) + 1;
    });
  });
  const topGenres = Object.entries(genreCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 2. Favorite Actors
  const actorCounts: Record<string, { count: number; avatarUrl: string | null }> = {};
  completedItems.forEach((item) => {
    const cast = item.details?.credits?.cast || [];
    cast.slice(0, 5).forEach((actor: any) => {
      if (!actorCounts[actor.name]) {
        actorCounts[actor.name] = { count: 0, avatarUrl: actor.profile_path };
      }
      actorCounts[actor.name].count += 1;
    });
  });
  const topActors = Object.entries(actorCounts)
    .map(([name, data]) => ({ name, count: data.count, avatarUrl: data.avatarUrl }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 3. Preferred Watch Hours
  const watchTimeCounts = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  };
  watchHistory.forEach((h) => {
    const hour = new Date(h.watchedAt).getHours();
    if (hour >= 6 && hour < 12) {
      watchTimeCounts.morning += 1;
    } else if (hour >= 12 && hour < 18) {
      watchTimeCounts.afternoon += 1;
    } else if (hour >= 18 && hour < 24) {
      watchTimeCounts.evening += 1;
    } else {
      watchTimeCounts.night += 1;
    }
  });
  const totalHistory = watchHistory.length || 1;
  const watchTimeStats = [
    { label: "Morning (06:00 - 12:00)", count: watchTimeCounts.morning, percentage: Math.round((watchTimeCounts.morning / totalHistory) * 100) },
    { label: "Afternoon (12:00 - 18:00)", count: watchTimeCounts.afternoon, percentage: Math.round((watchTimeCounts.afternoon / totalHistory) * 100) },
    { label: "Evening (18:00 - 00:00)", count: watchTimeCounts.evening, percentage: Math.round((watchTimeCounts.evening / totalHistory) * 100) },
    { label: "Night (00:00 - 06:00)", count: watchTimeCounts.night, percentage: Math.round((watchTimeCounts.night / totalHistory) * 100) },
  ];

  // 4. Total watch duration in hours
  const totalWatchTimeMinutes = completedItems.reduce((acc, item) => {
    const details = item.details as any;
    if (!details) return acc;
    const runtime = item.mediaType === "movie"
      ? details.runtime || 0
      : details.episode_run_time?.[0] || 45;
    return acc + runtime;
  }, 0);
  const totalWatchTimeHours = Math.round(totalWatchTimeMinutes / 60);

  const analyticsData = {
    topGenres,
    topActors,
    watchTimeStats,
    totalWatchTimeHours,
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardView
          user={{
            name: user.name,
            username: user.username,
            avatarUrl: user.avatarUrl,
            level: user.level,
            xp: user.xp,
            createdAt: user.createdAt,
          }}
          watchlist={watchlist}
          favorites={favorites}
          reviewCount={reviewCount}
          analyticsData={analyticsData}
        />
      </div>
    </div>
  );
}
