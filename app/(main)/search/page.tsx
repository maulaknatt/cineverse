"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X, Clock, TrendingUp, SlidersHorizontal, Star } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/utils/cn";
import { getPosterURL } from "@/utils/tmdb-image";
import { formatYear, getRatingColor } from "@/utils/format";
import { MOVIE_GENRES } from "@/constants/genres";
import type { TMDBSearchMulti, TMDBMovie, TMDBTVShow } from "@/types/tmdb";

const POPULAR_SEARCHES = [
  "Avengers",
  "Interstellar",
  "The Dark Knight",
  "Inception",
  "Stranger Things",
  "Game of Thrones",
  "Breaking Bad",
  "Oppenheimer",
];

type FilterState = {
  type: "all" | "movie" | "tv";
  minRating: number;
  year: string;
  genre: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBSearchMulti[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    minRating: 0,
    year: "",
    genre: "",
  });

  const debouncedQuery = useDebounce(query, 400);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(
    "cineverse-search-history",
    []
  );

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      
      let filtered = data.results || [];

      // Apply client-side filters
      if (filters.type !== "all") {
        filtered = filtered.filter((item: TMDBSearchMulti) => item.media_type === filters.type);
      }
      
      if (filters.minRating > 0) {
        filtered = filtered.filter((item: TMDBMovie | TMDBTVShow) => 
          (item.vote_average || 0) >= filters.minRating
        );
      }

      if (filters.year) {
        filtered = filtered.filter((item: TMDBMovie | TMDBTVShow) => {
          const date = "release_date" in item ? item.release_date : item.first_air_date;
          return date?.startsWith(filters.year);
        });
      }

      if (filters.genre) {
        filtered = filtered.filter((item: TMDBMovie | TMDBTVShow) => 
          item.genre_ids?.includes(Number(filters.genre))
        );
      }

      setResults(filtered);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim() && !searchHistory.includes(q)) {
      setSearchHistory((prev) => [q, ...prev].slice(0, 8));
    }
  };

  const clearHistory = () => setSearchHistory([]);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Search Movies & Series
          </h1>
          <p className="text-zinc-400">Discover your next favorite story</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-6"
        >
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 flex items-center">
              <SearchIcon className="absolute left-4 w-5 h-5 text-zinc-400 pointer-events-none" />
              <input
                id="search-input"
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by title, character, or genre..."
                autoFocus
                className="w-full pl-12 pr-12 py-4 bg-[#18181B] border border-white/10 focus:border-[#E50914]/50 rounded-2xl text-white placeholder:text-zinc-500 outline-none transition-all text-base focus:ring-2 focus:ring-[#E50914]/20"
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setResults([]); }}
                  className="absolute right-4 w-5 h-5 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center justify-center gap-2 h-[58px] px-4 rounded-2xl transition-all shrink-0 border text-sm font-medium",
                showFilters
                  ? "bg-[#E50914] border-[#E50914] text-white shadow-lg shadow-red-900/20"
                  : "glass border-white/10 text-zinc-400 hover:text-white"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-2xl mx-auto mb-8 overflow-hidden"
            >
              <div className="glass rounded-2xl border border-white/10 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(f => ({ ...f, type: e.target.value as FilterState["type"] }))}
                    className="w-full bg-[#27272A] text-white text-sm rounded-lg px-3 py-2 border border-white/10 outline-none"
                  >
                    <option value="all">All</option>
                    <option value="movie">Movies</option>
                    <option value="tv">Series</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5">Min Rating</label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters(f => ({ ...f, minRating: Number(e.target.value) }))}
                    className="w-full bg-[#27272A] text-white text-sm rounded-lg px-3 py-2 border border-white/10 outline-none"
                  >
                    <option value="0">Any</option>
                    <option value="6">6+ ⭐</option>
                    <option value="7">7+ ⭐</option>
                    <option value="8">8+ ⭐</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5">Year</label>
                  <input
                    type="number"
                    value={filters.year}
                    onChange={(e) => setFilters(f => ({ ...f, year: e.target.value }))}
                    placeholder="e.g. 2023"
                    className="w-full bg-[#27272A] text-white text-sm rounded-lg px-3 py-2 border border-white/10 outline-none placeholder:text-zinc-600"
                  />
                </div>

                {/* Genre Filter */}
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5">Genre</label>
                  <select
                    value={filters.genre}
                    onChange={(e) => setFilters(f => ({ ...f, genre: e.target.value }))}
                    className="w-full bg-[#27272A] text-white text-sm rounded-lg px-3 py-2 border border-white/10 outline-none"
                  >
                    <option value="">All</option>
                    {MOVIE_GENRES.slice(0, 10).map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State — Show history & popular */}
        {!query && (
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Search History */}
            {searchHistory.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-zinc-500 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="flex items-center gap-2 px-3 py-2 glass rounded-xl border border-white/10 text-sm text-zinc-300 hover:text-white hover:border-white/20 transition-all"
                    >
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-3">
                <TrendingUp className="w-4 h-4" />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-3 py-2 glass rounded-xl border border-white/10 text-sm text-zinc-300 hover:text-white hover:border-[#E50914]/30 hover:bg-[#E50914]/10 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="max-w-2xl mx-auto space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-3 rounded-xl bg-[#18181B] animate-pulse">
                <div className="w-12 h-18 rounded-lg shimmer shrink-0 aspect-poster" style={{ height: "72px", width: "48px" }} />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 shimmer rounded w-3/4" />
                  <div className="h-3 shimmer rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!isLoading && query && (
          <div className="max-w-2xl mx-auto">
            {results.length > 0 ? (
              <>
                <p className="text-sm text-zinc-400 mb-4">
                  {results.length} results for{" "}
                  <span className="text-white font-medium">&quot;{query}&quot;</span>
                </p>
                <div className="space-y-2">
                  {results.map((item) => {
                    if (item.media_type === "person") return null;

                    const title = "title" in item ? item.title : item.name;
                    const date = "release_date" in item ? item.release_date : item.first_air_date;
                    const href = `/${item.media_type === "tv" ? "tv" : "movies"}/${item.id}`;

                    return (
                      <motion.div
                        key={`${item.media_type}-${item.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={href}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#18181B] transition-all group"
                        >
                          {/* Thumbnail */}
                          <div className="relative w-12 h-18 rounded-lg overflow-hidden bg-zinc-800 shrink-0 aspect-poster">
                            {item.poster_path ? (
                              <Image
                                src={getPosterURL(item.poster_path, "w92")}
                                alt={title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                                ?
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white group-hover:text-[#E50914] transition-colors line-clamp-1">
                              {title}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              {item.vote_average > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                  <span className={cn("text-xs font-medium", getRatingColor(item.vote_average))}>
                                    {item.vote_average.toFixed(1)}
                                  </span>
                                </div>
                              )}
                              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                                {item.media_type}
                              </span>
                              <span className="text-xs text-zinc-500">
                                {formatYear(date)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🎬</div>
                <p className="text-zinc-400">
                  No results found for{" "}
                  <span className="text-white">&quot;{query}&quot;</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
