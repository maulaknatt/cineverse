"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Loader2, Film } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface Recommendation {
  title: string;
  year: number;
  genre: string;
  reason: string;
  tmdb_search_query: string;
}

interface AIRecommendationsProps {
  title: string;
  overview: string;
  genres: string;
}

export function AIRecommendations({ title, overview, genres }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);

  useEffect(() => {
    async function fetchAIRecommendations() {
      setIsLoading(true);
      setError(null);
      setIsLimitReached(false);
      try {
        const res = await fetch("/api/ai/similar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, overview, genres }),
        });

        if (res.ok) {
          const data = await res.json();
          setRecommendations(data.recommendations || []);
        } else if (res.status === 403) {
          const data = await res.json();
          if (data.error === "FREE_LIMIT_REACHED") {
            setIsLimitReached(true);
          } else {
            throw new Error("Failed to fetch similar recommendations");
          }
        } else {
          throw new Error("Failed to fetch similar recommendations");
        }
      } catch (err) {
        console.error(err);
        setError("Could not load AI recommendations at this time.");
      } finally {
        setIsLoading(false);
      }
    }

    if (title) {
      fetchAIRecommendations();
    }
  }, [title, overview, genres]);

  if (error) return null; // Silently hide if it fails, fallback to default TMDB

  if (isLimitReached) {
    return (
      <div className="mt-16 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <div className="w-8 h-8 rounded-lg bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center text-[#E50914]">
            <Sparkles className="w-4.5 h-4.5 text-[#E50914]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              AI-Powered Similar Picks
              <span className="text-[10px] uppercase tracking-widest bg-[#E50914] text-white px-2 py-0.5 rounded-full font-bold">
                Gemini
              </span>
            </h2>
            <p className="text-zinc-400 text-xs mt-0.5">
              Smart recommendations analyzed by Google Gemini based on themes, plot, and style.
            </p>
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="relative overflow-hidden rounded-2xl glass border border-[#E50914]/30 bg-gradient-to-r from-[#E50914]/10 via-zinc-950/40 to-[#E50914]/10 p-6 shadow-xl">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-xs font-bold text-[#E50914] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Daily limit reached (5/5)
              </div>
              <h3 className="font-extrabold text-white text-base">Get Unlimited AI Recommendations</h3>
              <p className="text-zinc-300 text-xs leading-relaxed max-w-xl">
                You&apos;ve used all 5 free AI recommendations for today. Upgrade to <span className="text-amber-500 font-bold">CineVerse PRO</span> to get unlimited AI similarity picks, direct chat with CineBot, and ad-free experience.
              </p>
            </div>
            <Link
              href="/upgrade"
              className="flex items-center gap-1.5 bg-[#E50914] hover:bg-[#b8070f] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-[#E50914]/15 hover:shadow-[#E50914]/30 hover:scale-102 transition-all shrink-0 cursor-pointer w-full md:w-auto justify-center"
            >
              <span>Unlock PRO Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <div className="w-8 h-8 rounded-lg bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center text-[#E50914]">
          <Sparkles className="w-4.5 h-4.5 text-[#E50914]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            AI-Powered Similar Picks
            <span className="text-[10px] uppercase tracking-widest bg-[#E50914] text-white px-2 py-0.5 rounded-full font-bold">
              Gemini
            </span>
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Smart recommendations analyzed by Google Gemini based on themes, plot, and style.
          </p>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        /* Shimmer Loading Skeleton */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="glass border-white/10 rounded-2xl p-5 space-y-4 animate-pulse relative overflow-hidden h-[180px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              <div className="h-4 bg-zinc-800 rounded-md w-3/4" />
              <div className="flex gap-2">
                <div className="h-3 bg-zinc-800 rounded-md w-10" />
                <div className="h-3 bg-zinc-800 rounded-md w-16" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-zinc-800 rounded-md w-full" />
                <div className="h-3 bg-zinc-800 rounded-md w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group glass border-white/10 hover:border-[#E50914]/30 hover:bg-[#E50914]/[0.02] p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all duration-300 relative overflow-hidden shadow-lg h-full"
            >
              {/* Top red glow decoration on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914]/0 group-hover:via-[#E50914]/50 to-transparent transition-all" />

              <div className="space-y-2">
                {/* Title */}
                <h3 className="font-bold text-white text-sm group-hover:text-[#E50914] transition-colors leading-snug line-clamp-1">
                  {rec.title}
                </h3>

                {/* Metadata badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-zinc-400 font-semibold">{rec.year}</span>
                  <span className="text-zinc-500 text-[10px]">•</span>
                  <span className="text-[10px] bg-white/5 border border-white/10 text-zinc-300 px-2 py-0.5 rounded-full font-medium">
                    {rec.genre}
                  </span>
                </div>

                {/* AI Reason */}
                <p className="text-zinc-400 text-xs leading-relaxed line-clamp-4 mt-2">
                  {rec.reason}
                </p>
              </div>

              {/* Action link */}
              <Link
                href={`/search?q=${encodeURIComponent(rec.tmdb_search_query || rec.title)}`}
                className="flex items-center gap-1.5 text-[11px] font-bold text-[#E50914] group-hover:translate-x-1 transition-transform self-start mt-2 cursor-pointer"
              >
                <span>Find on CineVerse</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
