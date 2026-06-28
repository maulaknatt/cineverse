import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-sync";
import { getMovieDetail } from "@/services/tmdb/movies";
import { getTVDetail } from "@/services/tmdb/tv";
import { UserProfileView } from "@/components/community/user-profile-view";
import type { Metadata } from "next";

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: UserProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} | CineVerse Profile`,
    description: `Check out @${username}'s reviews, watchlist, and film level on CineVerse.`,
  };
}

export const dynamic = "force-dynamic";

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = await params;

  // Fetch user from DB
  const dbUser = await prisma.user.findUnique({
    where: { username },
    include: {
      followers: true,
      following: true,
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!dbUser) {
    notFound();
  }

  // Get current logged-in user to determine if it is self-profile or following status
  const currentUser = await getOrCreateUser();
  const isSelf = currentUser ? currentUser.id === dbUser.id : false;

  if (isSelf) {
    // If it's the current user, redirect to /dashboard which is their private control panel
    redirect("/dashboard");
  }

  const isFollowing = currentUser
    ? dbUser.followers.some((f) => f.followerId === currentUser.id)
    : false;

  // Fetch watchlist and favorites
  const [dbWatchlist, dbFavorites] = await Promise.all([
    prisma.watchlistItem.findMany({
      where: { userId: dbUser.id },
      orderBy: { addedAt: "desc" },
    }),
    prisma.favorite.findMany({
      where: { userId: dbUser.id },
      orderBy: { addedAt: "desc" },
    }),
  ]);

  // Fetch watchlist details from TMDB
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
        console.error(err);
        return null;
      }
    })
  ).then((res) => res.filter(Boolean));

  // Fetch favorites details from TMDB
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
        console.error(err);
        return null;
      }
    })
  ).then((res) => res.filter(Boolean));

  // Fetch details for reviews written by the user from TMDB
  const reviews = await Promise.all(
    dbUser.reviews.map(async (review) => {
      try {
        const details = review.mediaType === "movie" 
          ? await getMovieDetail(review.tmdbId) 
          : await getTVDetail(review.tmdbId);
        return {
          ...review,
          details,
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    })
  ).then((res) => res.filter(Boolean));

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <UserProfileView
          user={{
            id: dbUser.id,
            name: dbUser.name,
            username: dbUser.username,
            avatarUrl: dbUser.avatarUrl,
            level: dbUser.level,
            xp: dbUser.xp,
            createdAt: dbUser.createdAt,
          }}
          followersCount={dbUser.followers.length}
          followingCount={dbUser.following.length}
          initialIsFollowing={isFollowing}
          isSelf={isSelf}
          watchlist={watchlist}
          favorites={favorites}
          reviews={reviews}
        />
      </div>
    </div>
  );
}
