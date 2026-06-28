"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Star, Heart, MessageSquare, AlertTriangle, Users, Trophy, UserPlus, UserMinus } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatRelativeTime } from "@/utils/format";
import { getPosterURL } from "@/utils/tmdb-image";
import { toast } from "sonner";
import { CommentDrawer } from "./comment-drawer";

interface User {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  level: number;
}

interface Review {
  id: string;
  userId: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  rating: number;
  content: string;
  hasSpoiler: boolean;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  createdAt: string | Date;
  user: User;
  details?: any; // TMDB Movie details
}

interface PopularUser {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  level: number;
  isFollowing: boolean;
}

interface CommunityViewProps {
  recentReviews: Review[];
  popularUsers: PopularUser[];
  currentUserId: string | null;
}

export function CommunityView({
  recentReviews: initialReviews,
  popularUsers: initialUsers,
  currentUserId,
}: CommunityViewProps) {
  const { userId } = useAuth();
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [users, setUsers] = useState<PopularUser[]>(initialUsers);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});
  
  // Comment drawer states
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);

  const handleToggleLike = async (reviewId: string, isLiked: boolean) => {
    if (!userId) {
      toast.error("Please sign in to like reviews!");
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
      return;
    }

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              isLiked: !isLiked,
              likesCount: isLiked ? r.likesCount - 1 : r.likesCount + 1,
            }
          : r
      )
    );

    try {
      const res = await fetch(`/api/reviews/${reviewId}/like`, {
        method: isLiked ? "DELETE" : "POST",
      });

      if (!res.ok) {
        toast.error("Failed to update like");
        // Refetch or toggle back
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowToggle = async (targetUser: PopularUser) => {
    if (!userId) {
      toast.error("Please sign in to follow users!");
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
      return;
    }

    const prevFollowing = targetUser.isFollowing;
    
    // Optimistic Update
    setUsers((prev) =>
      prev.map((u) =>
        u.id === targetUser.id ? { ...u, isFollowing: !prevFollowing } : u
      )
    );

    try {
      const res = await fetch(`/api/users/${targetUser.username}/follow`, {
        method: prevFollowing ? "DELETE" : "POST",
      });

      if (res.ok) {
        toast.success(prevFollowing ? `Unfollowed @${targetUser.username}` : `Following @${targetUser.username}!`);
        router.refresh();
      } else {
        // Rollback
        setUsers((prev) =>
          prev.map((u) =>
            u.id === targetUser.id ? { ...u, isFollowing: prevFollowing } : u
          )
        );
        toast.error("Failed to follow user");
      }
    } catch (err) {
      console.error(err);
      // Rollback
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id ? { ...u, isFollowing: prevFollowing } : u
        )
      );
      toast.error("An error occurred");
    }
  };

  const openCommentDrawer = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setIsCommentDrawerOpen(true);
  };

  const renderStars = (val: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (val >= i) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />);
      } else if (val === i - 0.5) {
        stars.push(
          <div key={i} className="relative w-3.5 h-3.5 shrink-0">
            <Star className="w-3.5 h-3.5 text-zinc-700 absolute left-0 top-0" />
            <span className="text-yellow-400 fill-yellow-400 overflow-hidden absolute left-0 top-0 w-1/2 block">
              ★
            </span>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-zinc-700 shrink-0" />);
      }
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Feed Timeline */}
      <div className="flex-1 space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight border-b border-white/15 pb-3">
          Activity Feed
        </h2>

        {reviews.length > 0 ? (
          reviews.map((review) => {
            const hasSpoilerVisible = review.hasSpoiler && !revealedSpoilers[review.id];

            return (
              <div
                key={review.id}
                className="glass border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 relative overflow-hidden"
              >
                {/* Movie Poster Thumbnail */}
                <Link
                  href={`/movies/${review.tmdbId}`}
                  className="relative w-20 sm:w-24 aspect-poster rounded-xl overflow-hidden border border-white/10 bg-zinc-800 shrink-0 shadow-lg hover:scale-105 transition-transform mx-auto sm:mx-0"
                >
                  {review.details?.poster_path ? (
                    <Image
                      src={getPosterURL(review.details.poster_path, "w185")}
                      alt={review.details.title || "Movie"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-500 bg-zinc-800">
                      No Poster
                    </div>
                  )}
                </Link>

                {/* Feed Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                  <div>
                    {/* User profile row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/users/${review.user.username}`}
                          className="relative w-7 h-7 rounded-full overflow-hidden bg-zinc-800 border border-white/10"
                        >
                          {review.user.avatarUrl ? (
                            <Image
                              src={review.user.avatarUrl}
                              alt={review.user.username}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-[10px] text-zinc-400 bg-zinc-800">
                              {review.user.username[0].toUpperCase()}
                            </div>
                          )}
                        </Link>
                        
                        <div className="flex items-center gap-1.5 flex-wrap text-xs">
                          <Link
                            href={`/users/${review.user.username}`}
                            className="font-bold text-zinc-200 hover:text-[#E50914] transition-colors"
                          >
                            {review.user.name || review.user.username}
                          </Link>
                          <span className="text-zinc-500 text-[10px]">reviewed</span>
                          <Link
                            href={`/movies/${review.tmdbId}`}
                            className="font-bold text-white hover:text-[#E50914] transition-colors"
                          >
                            {review.details?.title || `Movie #${review.tmdbId}`}
                          </Link>
                        </div>
                      </div>

                      <span className="text-[10px] text-zinc-500 shrink-0">
                        {formatRelativeTime(review.createdAt)}
                      </span>
                    </div>

                    {/* Rating row */}
                    <div className="flex items-center gap-2 mt-2">
                      {renderStars(review.rating)}
                      <span className="text-zinc-500 text-[10px]">•</span>
                      <span className="text-[10px] bg-[#E50914]/20 text-[#E50914] px-1.5 py-0.5 rounded-full font-bold">
                        Lv.{review.user.level}
                      </span>
                    </div>

                    {/* Review text */}
                    <div className="mt-3">
                      <p
                        className={cn(
                          "text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap italic",
                          hasSpoilerVisible && "blur-md select-none pointer-events-none"
                        )}
                      >
                        &quot;{review.content}&quot;
                      </p>

                      {hasSpoilerVisible && (
                        <button
                          onClick={() =>
                            setRevealedSpoilers((prev) => ({ ...prev, [review.id]: true }))
                          }
                          className="text-[10px] font-semibold text-[#E50914] bg-[#E50914]/10 hover:bg-[#E50914]/20 border border-[#E50914]/20 px-2.5 py-1.5 rounded-lg mt-2 cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Reveal Spoiler
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center gap-4 pt-2 border-t border-white/5 text-zinc-500">
                    <button
                      onClick={() => handleToggleLike(review.id, review.isLiked)}
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors",
                        review.isLiked ? "text-[#E50914]" : "hover:text-white"
                      )}
                    >
                      <Heart className={cn("w-3.5 h-3.5", review.isLiked && "fill-current")} />
                      <span>{review.likesCount}</span>
                    </button>

                    <button
                      onClick={() => openCommentDrawer(review.id)}
                      className="flex items-center gap-1.5 text-xs font-medium hover:text-white cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{review.commentsCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 glass border-white/10 rounded-2xl text-zinc-500">
            <span className="text-5xl block mb-4">📢</span>
            <p className="font-semibold text-white">No community activity yet</p>
            <p className="text-zinc-500 text-xs mt-1">Be the first to review movies and TV shows!</p>
          </div>
        )}
      </div>

      {/* Suggested Users Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight border-b border-white/15 pb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#E50914]" />
          Popular Reviewers
        </h2>

        <div className="glass border-white/10 rounded-2xl p-4 space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-3 text-sm pb-3 border-b border-white/5 last:pb-0 last:border-b-0">
                <div className="flex items-center gap-2.5">
                  <Link
                    href={`/users/${user.username}`}
                    className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-800 border border-white/10 shrink-0 hover:border-[#E50914] transition-colors"
                  >
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-zinc-400 bg-zinc-800">
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0">
                    <Link
                      href={`/users/${user.username}`}
                      className="font-bold text-white hover:text-[#E50914] transition-colors block truncate text-xs"
                    >
                      {user.name || user.username}
                    </Link>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-zinc-500">@{user.username}</span>
                      <span className="flex items-center text-[9px] text-[#E50914] font-bold">
                        <Trophy className="w-2.5 h-2.5 mr-0.5 fill-current" />
                        Lv.{user.level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Follow Button */}
                {currentUserId && currentUserId !== user.id && (
                  <button
                    onClick={() => handleFollowToggle(user)}
                    className={cn(
                      "p-1.5 rounded-lg cursor-pointer transition-all active:scale-95 outline-none shrink-0",
                      user.isFollowing
                        ? "bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                        : "bg-[#E50914] text-white hover:bg-[#b20710] shadow-sm shadow-[#E50914]/15"
                    )}
                    title={user.isFollowing ? "Unfollow" : "Follow"}
                  >
                    {user.isFollowing ? (
                      <UserMinus className="w-3.5 h-3.5" />
                    ) : (
                      <UserPlus className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-zinc-500 text-xs py-4 text-center">No active reviewers found</p>
          )}
        </div>
      </div>

      {/* Shared Comment Drawer */}
      <CommentDrawer
        reviewId={selectedReviewId}
        isOpen={isCommentDrawerOpen}
        onClose={() => {
          setIsCommentDrawerOpen(false);
          setSelectedReviewId(null);
          router.refresh();
        }}
      />
    </div>
  );
}
