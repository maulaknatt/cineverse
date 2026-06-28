"use client";

import { useState } from "react";
import Image from "next/image";
import { BookMarked, Heart, Calendar, Trophy, Star } from "lucide-react";
import { MovieCard } from "@/components/common/movie-card";
import { cn } from "@/utils/cn";

interface DashboardViewProps {
  user: {
    name: string | null;
    username: string;
    avatarUrl: string | null;
    level: number;
    xp: number;
    createdAt: Date;
  };
  watchlist: any[];
  favorites: any[];
  reviewCount: number;
}

export function DashboardView({ user, watchlist, favorites, reviewCount }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"watchlist" | "favorites">("watchlist");

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Level progress math: Assume each level is 100 XP
  const xpNeeded = 100;
  const xpPercentage = Math.min((user.xp / xpNeeded) * 100, 100);

  const completedCount = watchlist.filter((item) => item.status === "COMPLETED").length;

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/40 backdrop-blur-md shadow-2xl p-6 sm:p-8">
        {/* Background glow overlay */}
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {user.name || user.username}
            </h1>
            <p className="text-zinc-400 text-sm font-medium">@{user.username}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Joined {joinedDate}
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
            
            {/* Progress Bar */}
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
          { label: "Completed (Watched)", value: completedCount, icon: BookMarked },
          { label: "Favorites List", value: favorites.length, icon: Heart },
          { label: "Total Reviews", value: reviewCount, icon: Star },
          { label: "XP Status", value: `${user.xp} XP`, icon: Trophy },
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

      {/* Tab select buttons */}
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
        </div>
      </div>

      {/* Grid Content */}
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
            <div className="text-center py-20 glass border-white/10 rounded-2xl">
              <span className="text-5xl block mb-4">🎬</span>
              <h3 className="font-semibold text-white mb-1">Your Watchlist is empty</h3>
              <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                Explore movies and click &quot;Add to Watchlist&quot; to save them here!
              </p>
            </div>
          )
        ) : favorites.length > 0 ? (
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
          <div className="text-center py-20 glass border-white/10 rounded-2xl">
            <span className="text-5xl block mb-4">❤️</span>
            <h3 className="font-semibold text-white mb-1">No Favorites yet</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              Heart your favorite films and series to build your curation catalog here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
