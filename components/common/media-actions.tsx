"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { BookMarked, Heart, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

interface MediaActionsProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
  initialWatchlistStatus: "PLAN_TO_WATCH" | "WATCHING" | "COMPLETED" | "DROPPED" | null;
  initialInFavorites: boolean;
}

export function MediaActions({
  tmdbId,
  mediaType,
  initialWatchlistStatus,
  initialInFavorites,
}: MediaActionsProps) {
  const { userId } = useAuth();
  const router = useRouter();

  const [watchlistStatus, setWatchlistStatus] = useState<string | null>(initialWatchlistStatus);
  const [inFavorites, setInFavorites] = useState(initialInFavorites);
  
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(false);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (!userId) {
      toast.error("Please sign in to manage your watchlist!");
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
      return;
    }

    setIsWatchlistLoading(true);
    try {
      if (newStatus === "REMOVE") {
        const res = await fetch("/api/watchlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tmdbId, mediaType }),
        });

        if (res.ok) {
          setWatchlistStatus(null);
          toast.success("Removed from watchlist!");
          router.refresh();
        } else {
          toast.error("Failed to update watchlist");
        }
      } else {
        const res = await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tmdbId, mediaType, status: newStatus }),
        });

        if (res.ok) {
          const data = await res.json();
          setWatchlistStatus(newStatus);
          toast.success(`Watchlist updated to: ${newStatus.replace(/_/g, " ")}`);
          if (data.xpGained > 0) {
            toast.success(`Earned +${data.xpGained} XP! Level: ${data.currentLevel}`);
          }
          router.refresh();
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
          router.refresh();
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
          router.refresh();
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

  // Helper to format status text nicely
  const getStatusLabel = (status: string | null) => {
    if (!status) return "Add to Watchlist";
    switch (status) {
      case "PLAN_TO_WATCH":
        return "Plan to Watch";
      case "WATCHING":
        return "Watching";
      case "COMPLETED":
        return "Completed";
      case "DROPPED":
        return "Dropped";
      default:
        return status;
    }
  };

  return (
    <div className="flex gap-3 mt-6 w-full max-w-sm sm:max-w-md mx-auto lg:mx-0">
      <div className="flex-1 relative">
        <select
          value={watchlistStatus || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") {
              handleStatusChange("REMOVE");
            } else {
              handleStatusChange(val);
            }
          }}
          disabled={isWatchlistLoading}
          className={cn(
            "w-full appearance-none flex items-center justify-between gap-2 py-3.5 pl-11 pr-10 font-semibold rounded-xl transition-all active:scale-95 shadow-lg border outline-none cursor-pointer disabled:opacity-50 text-sm",
            watchlistStatus
              ? "bg-zinc-800 hover:bg-zinc-700 text-white border-white/10"
              : "bg-[#E50914] hover:bg-[#b20710] text-white border-[#E50914] shadow-[#E50914]/20"
          )}
        >
          {!watchlistStatus && (
            <option value="" className="bg-zinc-950 text-zinc-400">
              {isWatchlistLoading ? "Loading..." : "Add to Watchlist"}
            </option>
          )}
          <option value="PLAN_TO_WATCH" className="bg-zinc-950 text-white">
            📅 Plan to Watch
          </option>
          <option value="WATCHING" className="bg-zinc-950 text-white">
            👀 Watching
          </option>
          <option value="COMPLETED" className="bg-zinc-950 text-white">
            ✅ Completed (Watched)
          </option>
          <option value="DROPPED" className="bg-zinc-950 text-white">
            ❌ Dropped
          </option>
          {watchlistStatus && (
            <option value="" className="bg-zinc-950 text-rose-500 font-bold">
              🗑️ Remove from Watchlist
            </option>
          )}
        </select>
        
        {/* Custom Icon Overlay */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          {isWatchlistLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white/70" />
          ) : (
            <BookMarked
              className={cn(
                "w-5 h-5 transition-all",
                watchlistStatus ? "text-[#E50914] fill-[#E50914]" : "text-white/80"
              )}
            />
          )}
        </div>
        
        {/* Chevron Dropdown Arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      <button
        onClick={handleFavoritesToggle}
        disabled={isFavoritesLoading}
        className={cn(
          "w-14 h-14 rounded-xl glass border flex items-center justify-center transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0",
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
