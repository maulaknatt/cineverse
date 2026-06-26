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

  // Fetch watchlist and favorites from DB
  const [dbWatchlist, dbFavorites] = await Promise.all([
    prisma.watchlistItem.findMany({
      where: { userId: user.id },
      orderBy: { addedAt: "desc" },
    }),
    prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { addedAt: "desc" },
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
          details,
        };
      } catch (err) {
        console.error(`Failed to fetch TMDB details for watchlist item ${item.tmdbId}:`, err);
        return null;
      }
    })
  ).then((res) => res.filter(Boolean));

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
  ).then((res) => res.filter(Boolean));

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
        />
      </div>
    </div>
  );
}
