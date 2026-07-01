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
  getMovieDetail,
} from "@/services/tmdb/movies";
import { getTrendingTV, getPopularTV } from "@/services/tmdb/tv";
import { cookies } from "next/headers";
import { translations } from "@/constants/translations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CineVerse — Discover Movies Smarter",
  description:
    "AI-powered movie discovery. Find movies by mood, genre, actor, and more. Track your watchlist and join the community.",
};

export const revalidate = 3600; // 1 hour ISR

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const t = translations[lang === "id" ? "id" : "en"];
  const tmdbLang = lang === "id" ? "id-ID" : "en-US";

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
    getTrendingMovies("day", tmdbLang),
    getTrendingMovies("week", tmdbLang),
    getPopularMovies(1, tmdbLang),
    getTopRatedMovies(1, tmdbLang),
    getNowPlayingMovies(1, tmdbLang),
    getUpcomingMovies(1, tmdbLang),
    getTrendingTV("day", tmdbLang),
    getPopularTV(1, tmdbLang),
  ]);

  const heroMovies = trendingDayRes.results.slice(0, 5);

  // Fallback empty overviews in heroMovies if Indonesian is selected
  if (lang === "id") {
    await Promise.all(
      heroMovies.map(async (movie) => {
        if (!movie.overview) {
          try {
            const enMovie = await getMovieDetail(movie.id, "en-US");
            movie.overview = enMovie.overview;
          } catch (e) {
            console.error("Failed to fetch English fallback overview for HeroBanner movie:", e);
          }
        }
      })
    );
  }

  const stats =
    lang === "id"
      ? [
          { value: "850K+", label: "Film & Acara TV" },
          { value: "3M+", label: "Kru & Pemeran" },
          { value: "AI", label: "Rekomendasi Pintar" },
          { value: "Gratis", label: "Selamanya" },
        ]
      : [
          { value: "850K+", label: "Movies & TV Shows" },
          { value: "3M+", label: "People & Cast" },
          { value: "AI", label: "Powered Recommendations" },
          { value: "Free", label: "Forever" },
        ];

  return (
    <>
      <HeroBanner movies={heroMovies} />

      {/* Main Content */}
      <div className="space-y-8 py-8">
        <MovieCarousel
          title={`🔥 ${t.trendingToday}`}
          subtitle={t.trendingTodaySub}
          items={trendingDayRes.results}
          mediaType="movie"
          seeAllHref="/trending"
        />

        <MovieCarousel
          title={`📈 ${t.trendingWeek}`}
          subtitle={t.trendingWeekSub}
          items={trendingWeekRes.results}
          mediaType="movie"
          seeAllHref="/trending"
        />

        <AISection />

        <MovieCarousel
          title={`🍿 ${t.popularMovies}`}
          subtitle={t.popularMoviesSub}
          items={popularRes.results}
          mediaType="movie"
          seeAllHref="/movies?sort=popularity.desc"
        />

        <MovieCarousel
          title={`⭐ ${t.topRated}`}
          subtitle={t.topRatedSub}
          items={topRatedRes.results}
          mediaType="movie"
          seeAllHref="/movies?sort=vote_average.desc"
        />

        <GenresSection />

        <MovieCarousel
          title={`📺 ${t.trendingSeries}`}
          subtitle={t.trendingSeriesSub}
          items={trendingTVRes.results}
          mediaType="tv"
          seeAllHref="/tv"
        />

        <MovieCarousel
          title={`🎭 ${t.popularSeries}`}
          subtitle={t.popularSeriesSub}
          items={popularTVRes.results}
          mediaType="tv"
          seeAllHref="/tv"
        />

        <MovieCarousel
          title={`🎬 ${t.nowPlaying}`}
          subtitle={t.nowPlayingSub}
          items={nowPlayingRes.results}
          mediaType="movie"
          seeAllHref="/movies"
        />

        <MovieCarousel
          title={`📅 ${t.upcoming}`}
          subtitle={t.upcomingSub}
          items={upcomingRes.results}
          mediaType="movie"
          seeAllHref="/movies"
        />

        {/* Dynamic Sponsor Ad Banner */}
        <AdBanner />
      </div>

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
