"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { BookMarked, Heart, Calendar, Trophy, Star, Users, UserPlus, UserMinus, MessageSquare } from "lucide-react";
import { MovieCard } from "@/components/common/movie-card";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { getPosterURL } from "@/utils/tmdb-image";

interface UserProfileViewProps {
  user: {
    id: string;
    name: string | null;
    username: string;
    avatarUrl: string | null;
    level: number;
    xp: number;
    createdAt: string | Date;
  };
  followersCount: number;
  followingCount: number;
  initialIsFollowing: boolean;
  isSelf: boolean;
  watchlist: any[];
  favorites: any[];
  reviews: any[];
}

export function UserProfileView({
  user,
  followersCount,
  followingCount,
  initialIsFollowing,
  isSelf,
  watchlist,
  favorites,
  reviews,
}: UserProfileViewProps) {
  const { userId } = useAuth();
  const router = useRouter();

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCountState, setFollowersCountState] = useState(followersCount);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"watchlist" | "favorites" | "reviews">("watchlist");

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const xpNeeded = 100;
  const xpPercentage = Math.min((user.xp / xpNeeded) * 100, 100);

  const handleFollowToggle = async () => {
    if (!userId) {
      toast.error("Please sign in to follow users!");
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
      return;
    }

    setIsFollowLoading(true);
    // Optimistic Update
    const prevFollowing = isFollowing;
    setIsFollowing(!prevFollowing);
    setFollowersCountState((prev) => (prevFollowing ? prev - 1 : prev + 1));

    try {
      const res = await fetch(`/api/users/${user.username}/follow`, {
        method: prevFollowing ? "DELETE" : "POST",
      });

      if (res.ok) {
        toast.success(prevFollowing ? `Unfollowed @${user.username}` : `Following @${user.username}!`);
      } else {
        // Rollback
        setIsFollowing(prevFollowing);
        setFollowersCountState((prev) => (prevFollowing ? prev + 1 : prev - 1));
        toast.error("Failed to update follow");
      }
    } catch (err) {
      console.error(err);
      // Rollback
      setIsFollowing(prevFollowing);
      setFollowersCountState((prev) => (prevFollowing ? prev + 1 : prev - 1));
      toast.error("An error occurred");
    } finally {
      setIsFollowLoading(false);
    }
  };

  // Helper to render stars
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
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/40 backdrop-blur-md shadow-2xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E50914]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          {/* Avatar */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#E50914] shrink-0 bg-zinc-800">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name || user.username}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl text-zinc-500 font-bold bg-zinc-800">
                {user.username[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* User info */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {user.name || user.username}
              </h1>
              
              {/* Follow Button */}
              {!isSelf && (
                <button
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                  className={cn(
                    "flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition-all outline-none disabled:opacity-50",
                    isFollowing
                      ? "glass border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                      : "bg-[#E50914] hover:bg-[#b20710] text-white shadow-lg shadow-[#E50914]/20"
                  )}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="w-3.5 h-3.5" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
            
            <p className="text-zinc-400 text-sm font-medium">@{user.username}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Joined {joinedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-zinc-500" />
                {followersCountState} followers • {followingCount} following
              </span>
            </div>
          </div>

          {/* User Level card */}
          <div className="w-full md:w-64 glass border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-[#E50914]" />
                Level {user.level}
              </span>
              <span className="text-zinc-500 font-medium">{user.xp} / {xpNeeded} XP</span>
            </div>
            
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
              <div
                className="bg-[#E50914] h-full rounded-full transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Watchlist Items", value: watchlist.length, icon: BookMarked },
          { label: "Favorites List", value: favorites.length, icon: Heart },
          { label: "Total Reviews", value: reviews.length, icon: MessageSquare },
          { label: "Followers Count", value: followersCountState, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass border-white/10 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 shrink-0 border border-white/5">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">{value}</p>
              <p className="text-xs text-zinc-500 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Select buttons */}
      <div className="border-b border-white/5">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("watchlist")}
            className={cn(
              "flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer",
              activeTab === "watchlist"
                ? "border-[#E50914] text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            )}
          >
            <BookMarked className="w-4 h-4" />
            Watchlist ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={cn(
              "flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer",
              activeTab === "favorites"
                ? "border-[#E50914] text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            )}
          >
            <Heart className="w-4 h-4" />
            Favorites ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={cn(
              "flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer",
              activeTab === "reviews"
                ? "border-[#E50914] text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            )}
          >
            <MessageSquare className="w-4 h-4" />
            Reviews ({reviews.length})
          </button>
        </div>
      </div>

      {/* Tab Grid Content */}
      <div>
        {activeTab === "watchlist" ? (
          watchlist.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {watchlist.map((item) => (
                <MovieCard
                  key={item.id}
                  media={item.details}
                  mediaType={item.mediaType}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass border-white/10 rounded-2xl text-zinc-500">
              <span className="text-4xl block mb-2">🎬</span>
              <p className="font-semibold text-white text-sm">Watchlist is empty</p>
            </div>
          )
        ) : activeTab === "favorites" ? (
          favorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {favorites.map((item) => (
                <MovieCard
                  key={item.id}
                  media={item.details}
                  mediaType={item.mediaType}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass border-white/10 rounded-2xl text-zinc-500">
              <span className="text-4xl block mb-2">❤️</span>
              <p className="font-semibold text-white text-sm">No favorites added</p>
            </div>
          )
        ) : (
          /* Reviews Tab */
          reviews.length > 0 ? (
            <div className="space-y-4 max-w-4xl">
              {reviews.map((review) => (
                <div key={review.id} className="glass border-white/10 p-5 rounded-2xl flex gap-4 items-start relative overflow-hidden">
                  {/* Poster Thumbnail */}
                  <Link
                    href={`/movies/${review.tmdbId}`}
                    className="relative w-16 sm:w-20 aspect-poster rounded-xl overflow-hidden border border-white/10 shrink-0 bg-zinc-800 shadow-lg hover:scale-105 transition-transform"
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
                        No Image
                      </div>
                    )}
                  </Link>

                  {/* Review Text */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <Link
                        href={`/movies/${review.tmdbId}`}
                        className="font-bold text-white hover:text-[#E50914] text-sm sm:text-base leading-tight transition-colors line-clamp-1"
                      >
                        {review.details?.title || `Movie #${review.tmdbId}`}
                      </Link>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-zinc-500 text-xs">•</span>
                      <span className="text-zinc-500 text-xs">{review.likesCount} likes</span>
                    </div>

                    <p className="text-zinc-300 text-xs leading-relaxed whitespace-pre-wrap line-clamp-4 italic">
                      &quot;{review.content}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass border-white/10 rounded-2xl text-zinc-500">
              <span className="text-4xl block mb-2">✍️</span>
              <p className="font-semibold text-white text-sm">No reviews written yet</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
