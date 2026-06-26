import { MovieCarousel } from "@/components/common/movie-carousel";
import { getTrendingMovies } from "@/services/tmdb/movies";
import { getTrendingTV } from "@/services/tmdb/tv";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending",
  description: "Discover what's trending today",
};

export const revalidate = 3600;

export default async function TrendingPage() {
  const [trendingMoviesDay, trendingMoviesWeek, trendingTVDay] = await Promise.all([
    getTrendingMovies("day"),
    getTrendingMovies("week"),
    getTrendingTV("day"),
  ]);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          🔥 Trending
        </h1>
        <p className="text-zinc-400">Popular right now</p>
      </div>

      <div className="space-y-10">
        <MovieCarousel
          title="Trending Movies (Today)"
          items={trendingMoviesDay.results}
          mediaType="movie"
        />
        <MovieCarousel
          title="Trending Movies (This Week)"
          items={trendingMoviesWeek.results}
          mediaType="movie"
        />
        <MovieCarousel
          title="Trending Series"
          items={trendingTVDay.results}
          mediaType="tv"
          seeAllHref="/tv"
        />
      </div>
    </div>
  );
}
