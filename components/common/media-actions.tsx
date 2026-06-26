"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { BookMarked, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

interface MediaActionsProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
  initialInWatchlist: boolean;
  initialInFavorites: boolean;
}

export function MediaActions({
  tmdbId,
  mediaType,
  initialInWatchlist,
  initialInFavorites,
}: MediaActionsProps) {
  const { userId } = useAuth();
  const router = useRouter();

  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist);
  const [inFavorites, setInFavorites] = useState(initialInFavorites);
  
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(false);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);

  const handleWatchlistToggle = async () => {
    if (!userId) {
      toast.error("Please sign in to add to your watchlist!");
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
      return;
    }

    setIsWatchlistLoading(true);
    try {
      if (inWatchlist) {
        // Remove from watchlist
        const res = await fetch("/api/watchlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tmdbId, mediaType }),
        });

        if (res.ok) {
          setInWatchlist(false);
          toast.success("Removed from watchlist!");
        } else {
          toast.error("Failed to update watchlist");
        }
      } else {
        // Add to watchlist
        const res = await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tmdbId, mediaType, status: "PLAN_TO_WATCH" }),
        });

        if (res.ok) {
          setInWatchlist(true);
          toast.success("Added to watchlist!");
        } else {
          toast.error("Failed to update watchlist");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsWatchlistLoading(false);
    }
  };

  const handleFavoritesToggle = async () => {
    if (!userId) {
      toast.error("Please sign in to add to your favorites!");
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
      return;
    }

    setIsFavoritesLoading(true);
    try {
      if (inFavorites) {
        // Remove from favorites
        const res = await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tmdbId, mediaType }),
        });

        if (res.ok) {
          setInFavorites(false);
          toast.success("Removed from favorites!");
        } else {
          toast.error("Failed to update favorites");
        }
      } else {
        // Add to favorites
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tmdbId, mediaType }),
        });

        if (res.ok) {
          setInFavorites(true);
          toast.success("Added to favorites!");
        } else {
          toast.error("Failed to update favorites");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsFavoritesLoading(false);
    }
  };

  return (
    <div className="flex gap-3 mt-6 w-full max-w-sm sm:max-w-md mx-auto lg:mx-0">
      <button
        onClick={handleWatchlistToggle}
        disabled={isWatchlistLoading}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-3.5 font-semibold rounded-xl transition-all active:scale-95 shadow-lg border outline-none cursor-pointer disabled:opacity-50",
          inWatchlist
            ? "bg-zinc-800 hover:bg-zinc-700 text-white border-white/10"
            : "bg-[#E50914] hover:bg-[#b20710] text-white border-[#E50914] shadow-[#E50914]/20"
        )}
      >
        {isWatchlistLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <BookMarked className={cn("w-5 h-5", inWatchlist && "text-[#E50914] fill-[#E50914]")} />
        )}
        {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
      </button>

      <button
        onClick={handleFavoritesToggle}
        disabled={isFavoritesLoading}
        className={cn(
          "w-14 h-14 rounded-xl glass border flex items-center justify-center transition-all active:scale-95 cursor-pointer disabled:opacity-50",
          inFavorites
            ? "border-[#E50914]/30 bg-[#E50914]/10 text-[#E50914]"
            : "border-white/10 text-zinc-300 hover:text-[#E50914] hover:border-[#E50914]/30 hover:bg-[#E50914]/5"
        )}
        aria-label={inFavorites ? "Remove from Favorites" : "Add to Favorites"}
      >
        {isFavoritesLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Heart className={cn("w-6 h-6", inFavorites && "fill-current")} />
        )}
      </button>
    </div>
  );
}
