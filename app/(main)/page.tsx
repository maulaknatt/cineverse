import { HeroBanner } from "@/features/landing/hero-banner";
import { AISection } from "@/features/landing/ai-section";
import { GenresSection } from "@/features/landing/genres-section";
import { MovieCarousel } from "@/components/common/movie-carousel";
import { AdBanner } from "@/components/common/ad-banner";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
} from "@/services/tmdb/movies";
import { getTrendingTV, getPopularTV } from "@/services/tmdb/tv";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CineVerse — Discover Movies Smarter",
  description:
    "AI-powered movie discovery. Find movies by mood, genre, actor, and more. Track your watchlist and join the community.",
};

export const revalidate = 3600; // 1 hour ISR

export default async function HomePage() {
  const [
    trendingDayRes,
    trendingWeekRes,
    popularRes,
    topRatedRes,
    nowPlayingRes,
    upcomingRes,
    trendingTVRes,
    popularTVRes,
  ] = await Promise.all([
    getTrendingMovies("day"),
    getTrendingMovies("week"),
    getPopularMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
    getTrendingTV("day"),
    getPopularTV(),
  ]);

  const heroMovies = trendingDayRes.results.slice(0, 5);

  return (
    <>
      <HeroBanner movies={heroMovies} />

      {/* Main Content */}
      <div className="space-y-8 py-8">
        <MovieCarousel
          title="🔥 Trending Today"
          subtitle="Top movies right now"
          items={trendingDayRes.results}
          mediaType="movie"
          seeAllHref="/trending"
        />

        <MovieCarousel
          title="📈 Trending This Week"
          subtitle="Movies making waves"
          items={trendingWeekRes.results}
          mediaType="movie"
          seeAllHref="/trending"
        />

        <AISection />

        <MovieCarousel
          title="🍿 Popular Movies"
          subtitle="Fan favorites"
          items={popularRes.results}
          mediaType="movie"
          seeAllHref="/movies?sort=popularity.desc"
        />

        <MovieCarousel
          title="⭐ Top Rated"
          subtitle="Critically acclaimed masterpieces"
          items={topRatedRes.results}
          mediaType="movie"
          seeAllHref="/movies?sort=vote_average.desc"
        />

        <GenresSection />

        <MovieCarousel
          title="📺 Trending Series"
          subtitle="Binge-worthy series"
          items={trendingTVRes.results}
          mediaType="tv"
          seeAllHref="/tv"
        />

        <MovieCarousel
          title="🎭 Popular Series"
          subtitle="Most watched series"
          items={popularTVRes.results}
          mediaType="tv"
          seeAllHref="/tv"
        />

        <MovieCarousel
          title="🎬 Now Playing"
          subtitle="Currently in theaters"
          items={nowPlayingRes.results}
          mediaType="movie"
          seeAllHref="/movies"
        />

        <MovieCarousel
          title="📅 Upcoming"
          subtitle="Coming soon to theaters"
          items={upcomingRes.results}
          mediaType="movie"
          seeAllHref="/movies"
        />

        {/* Dynamic Sponsor Ad Banner */}
        <AdBanner />
      </div>

      <StatsSection />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "CineVerse",
            description: "AI-powered movie discovery platform",
            url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            potentialAction: {
              "@type": "SearchAction",
              target: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </>
  );
}

function StatsSection() {
  const stats = [
    { value: "850K+", label: "Movies & TV Shows" },
    { value: "3M+", label: "People & Cast" },
    { value: "AI", label: "Powered Recommendations" },
    { value: "Free", label: "Forever" },
  ];

  return (
    <section className="py-16 border-t border-white/5">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                {value}
              </div>
              <div className="text-sm text-zinc-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
