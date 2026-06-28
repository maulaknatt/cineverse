import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user-sync";
import { getMovieDetail } from "@/services/tmdb/movies";
import { getTVDetail } from "@/services/tmdb/tv";
import { CommunityView } from "@/components/community/community-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Hub | CineVerse",
  description: "See what other CineVerse members are watching and reviewing in real time.",
};

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const currentUser = await getOrCreateUser();
  const currentUserId = currentUser?.id || null;

  // 1. Fetch recent reviews
  const dbRecentReviews = await prisma.review.findMany({
    take: 12,
    orderBy: { createdAt: "desc" },
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
      likes: currentUserId
        ? {
            where: { userId: currentUserId },
          }
        : false,
      _count: {
        select: { comments: true },
      },
    },
  });

  // Fetch TMDB details for reviews in parallel
  const recentReviews = await Promise.all(
    dbRecentReviews.map(async (review) => {
      try {
        const details = review.mediaType === "movie" 
          ? await getMovieDetail(review.tmdbId) 
          : await getTVDetail(review.tmdbId);
        
        return {
          id: review.id,
          userId: review.userId,
          tmdbId: review.tmdbId,
          mediaType: review.mediaType as "movie" | "tv",
          rating: review.rating,
          content: review.content,
          hasSpoiler: review.hasSpoiler,
          likesCount: review.likesCount,
          isLiked: currentUserId ? (review.likes as any[]).length > 0 : false,
          commentsCount: review._count.comments,
          createdAt: review.createdAt.toISOString(),
          user: review.user,
          details,
        };
      } catch (err) {
        console.error(`Failed to fetch TMDB details for review ${review.id}:`, err);
        return null;
      }
    })
  ).then((res) => res.filter(Boolean));

  // 2. Fetch popular users/reviewers
  const dbPopularUsers = await prisma.user.findMany({
    take: 6,
    orderBy: { level: "desc" },
    include: {
      followers: currentUserId
        ? {
            where: { followerId: currentUserId },
          }
        : false,
    },
  });

  const popularUsers = dbPopularUsers.map((user) => ({
    id: user.id,
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
    level: user.level,
    isFollowing: currentUserId ? (user.followers as any[]).length > 0 : false,
  }));

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">CineVerse Community</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Connect with film lovers, share reviews, and follow creators.
          </p>
        </div>

        <CommunityView
          recentReviews={recentReviews as any[]}
          popularUsers={popularUsers}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
