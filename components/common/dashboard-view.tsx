"use client";

import { useState } from "react";
import Image from "next/image";
import { BookMarked, Heart, Calendar, Trophy, Star, BarChart2, Lock } from "lucide-react";
import { MovieCard } from "@/components/common/movie-card";
import { cn } from "@/utils/cn";
import { getPosterURL } from "@/utils/tmdb-image";
import { motion } from "framer-motion";
import Link from "next/link";

interface DashboardViewProps {
  user: {
    name: string | null;
    username: string;
    avatarUrl: string | null;
    level: number;
    xp: number;
    createdAt: Date;
    isPro: boolean;
  };
  watchlist: any[];
  favorites: any[];
  reviewCount: number;
  analyticsData: {
    topGenres: Array<{ name: string; count: number }>;
    topActors: Array<{ name: string; count: number; avatarUrl: string | null }>;
    watchTimeStats: Array<{ label: string; count: number; percentage: number }>;
    totalWatchTimeHours: number;
  };
}

export function DashboardView({ user, watchlist, favorites, reviewCount, analyticsData }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"watchlist" | "favorites" | "analytics">("watchlist");

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
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              {user.name || user.username}
              {user.isPro && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/5">
                  PRO
                </span>
              )}
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
          <button
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer",
              activeTab === "analytics"
                ? "border-[#E50914] text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            )}
          >
            <BarChart2 className="w-4 h-4" />
            Analytics 📈
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div>
        {/* Watchlist Tab */}
        {activeTab === "watchlist" && (
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
        )}

        {/* Favorites list */}
        {activeTab === "favorites" && (
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
            <div className="text-center py-20 glass border-white/10 rounded-2xl">
              <span className="text-5xl block mb-4">❤️</span>
              <h3 className="font-semibold text-white mb-1">No Favorites yet</h3>
              <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                Heart your favorite films and series to build your curation catalog here!
              </p>
            </div>
          )
        )}

        {/* Analytics Tab (Tahap 5 / 7) */}
        {activeTab === "analytics" && user.isPro && (
          <div className="space-y-8 animate-fade-in">
            {/* Watch Time Summary Card */}
            <div className="glass border-white/10 rounded-3xl p-6 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/[0.03] rounded-full blur-[50px] pointer-events-none" />
              <div className="space-y-1 relative z-10">
                <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Watch Time</h3>
                <p className="text-3xl font-extrabold text-white tracking-tight">
                  {analyticsData.totalWatchTimeHours} <span className="text-sm font-semibold text-zinc-400">Hours</span>
                </p>
                <p className="text-zinc-500 text-xs">Accumulated runtime of all your completed movies and series.</p>
              </div>
              <span className="text-4xl select-none">⏱️</span>
            </div>

            {/* Sub charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Genre Chart */}
              <div className="glass border-white/10 rounded-3xl p-6 space-y-6">
                <div>
                  <h4 className="font-bold text-white text-base">Favorite Genres</h4>
                  <p className="text-zinc-500 text-xs mt-0.5">Most watched genres in your catalog.</p>
                </div>
                
                <div className="space-y-4">
                  {analyticsData.topGenres.length > 0 ? (
                    analyticsData.topGenres.map((genre, idx) => {
                      const maxVal = analyticsData.topGenres[0]?.count || 1;
                      const pct = Math.round((genre.count / maxVal) * 100);
                      const barColors = [
                        "bg-[#E50914]",
                        "bg-rose-500",
                        "bg-amber-500",
                        "bg-sky-500",
                        "bg-indigo-500",
                      ];
                      const color = barColors[idx % barColors.length];

                      return (
                        <div key={genre.name} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-zinc-300">{genre.name}</span>
                            <span className="text-white">{genre.count} titles</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.1 }}
                              className={cn("h-full rounded-full", color)}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-zinc-500 text-xs py-8 text-center">Mark titles as completed to calculate genres</p>
                  )}
                </div>
              </div>

              {/* Watch Time Preference */}
              <div className="glass border-white/10 rounded-3xl p-6 space-y-6">
                <div>
                  <h4 className="font-bold text-white text-base">Watch Time Preferences</h4>
                  <p className="text-zinc-500 text-xs mt-0.5">When you usually enjoy watching movies.</p>
                </div>

                <div className="space-y-4">
                  {analyticsData.watchTimeStats.some(s => s.count > 0) ? (
                    analyticsData.watchTimeStats.map((stat, idx) => {
                      const timeColors = [
                        "bg-amber-400 shadow-amber-400/10",
                        "bg-sky-400 shadow-sky-400/10",
                        "bg-indigo-500 shadow-indigo-500/10",
                        "bg-purple-600 shadow-purple-600/10",
                      ];
                      const color = timeColors[idx % timeColors.length];

                      return (
                        <div key={stat.label} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-zinc-300">{stat.label}</span>
                            <span className="text-white">{stat.percentage}%</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.percentage}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.1 }}
                              className={cn("h-full rounded-full shadow-lg", color)}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-zinc-500 text-xs py-8 text-center">Add titles to history to track watch times</p>
                  )}
                </div>
              </div>
            </div>

            {/* Favorite Cast */}
            <div className="glass border-white/10 rounded-3xl p-6 space-y-6">
              <div>
                <h4 className="font-bold text-white text-base">Star Cast Appearances</h4>
                <p className="text-zinc-500 text-xs mt-0.5">Your most watched actors based on completed movie cast listings.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {analyticsData.topActors.length > 0 ? (
                  analyticsData.topActors.map((actor, idx) => (
                    <motion.div
                      key={actor.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex flex-col items-center text-center p-3 glass border-white/5 hover:border-white/10 rounded-2xl transition-all"
                    >
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-zinc-800 border-2 border-white/10 mb-3 shrink-0 shadow-md shadow-black/35">
                        {actor.avatarUrl ? (
                          <Image
                            src={getPosterURL(actor.avatarUrl, "w185")}
                            alt={actor.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-xs bg-zinc-800">
                            {actor.name[0]}
                          </div>
                        )}
                      </div>
                      <h5 className="font-bold text-white text-xs line-clamp-1">{actor.name}</h5>
                      <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{actor.count} titles watched</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-xs py-8 text-center col-span-full">Mark titles as completed to compile cast stars</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Locked Analytics for Free Users (Tahap 7) */}
        {activeTab === "analytics" && !user.isPro && (
          <div className="relative glass border-white/10 rounded-3xl p-8 overflow-hidden h-[400px] flex flex-col items-center justify-center text-center space-y-5 animate-fade-in shadow-2xl">
            {/* Background blur decorative */}
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[6px] z-10 pointer-events-none" />
            
            {/* Lock Icon and Text */}
            <div className="relative z-20 space-y-3 max-w-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 mb-2 shadow-lg shadow-amber-500/10">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">Unlock Advanced Analytics</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Track your cinematic habits! Upgrade to PRO to view detailed statistics of your favorite genres, actor cast appearances, and watch hour preferences.
              </p>
            </div>

            <div className="relative z-20 pt-2 w-full max-w-xs">
              <Link
                href="/upgrade"
                className="inline-flex w-full bg-[#E50914] hover:bg-[#b8070f] text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-[#E50914]/25 transition-all justify-center cursor-pointer"
              >
                Upgrade to PRO ($4.99/mo)
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
