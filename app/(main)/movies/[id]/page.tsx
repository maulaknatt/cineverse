import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, Globe, ArrowLeft } from "lucide-react";
import { getMovieDetail } from "@/services/tmdb/movies";
import { getBackdropURL, getPosterURL, getProfileURL } from "@/utils/tmdb-image";
import { formatYear, formatCurrency } from "@/utils/format";
import { GenreBadge, RatingBadge, SectionHeader } from "@/components/common/section-header";
import { MovieCarousel } from "@/components/common/movie-carousel";
import { ReviewSection } from "@/components/community/review-section";
import { AIRecommendations } from "@/components/community/ai-recommendations";
import { AdBanner } from "@/components/common/ad-banner";
import type { Metadata } from "next";

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = String(id).split("-")[0];
  try {
    const movie = await getMovieDetail(numericId);
    return {
      title: movie.title,
      description: movie.overview,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: [{ url: getBackdropURL(movie.backdrop_path, "w1280") }],
      },
    };
  } catch {
    return { title: "Movie Not Found" };
  }
}

export const revalidate = 86400; // 24 hours

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { MediaActions } from "@/components/common/media-actions";
import { WatchProviders } from "@/components/common/watch-providers";
import { cookies } from "next/headers";
import { translations } from "@/constants/translations";

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;
  const numericId = String(id).split("-")[0];
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const t = translations[lang === "id" ? "id" : "en"];
  const tmdbLang = lang === "id" ? "id-ID" : "en-US";
  let movie;

  try {
    movie = await getMovieDetail(numericId, tmdbLang);
  } catch {
    notFound();
  }

  // Fetch initial watchlist/favorites state if user is logged in
  const { userId: clerkId } = await auth();
  let initialWatchlistStatus: "PLAN_TO_WATCH" | "WATCHING" | "COMPLETED" | "DROPPED" | null = null;
  let initialInFavorites = false;

  if (clerkId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        watchlistItems: {
          where: { tmdbId: movie.id, mediaType: "movie" },
        },
        favorites: {
          where: { tmdbId: movie.id, mediaType: "movie" },
        },
      },
    });

    if (dbUser) {
      initialWatchlistStatus = (dbUser.watchlistItems[0]?.status as "PLAN_TO_WATCH" | "WATCHING" | "COMPLETED" | "DROPPED") || null;
      initialInFavorites = dbUser.favorites.length > 0;
    }
  }

  const cast = movie.credits?.cast.slice(0, 10) || [];
  const director = movie.credits?.crew.find((c) => c.job === "Director");
  const trailer = movie.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const recommendations = movie.recommendations?.results || [];

  return (
    <div className="min-h-screen pb-16">
      {/* Backdrop Hero */}
      <div className="relative w-full h-[70vh] min-h-[500px] bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {movie.backdrop_path && (
            <Image
              src={getBackdropURL(movie.backdrop_path, "original")}
              alt={movie.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-[#09090B]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-black/20" />

        {/* Back Button */}
        <div className="absolute top-20 left-4 sm:left-8 z-20">
          <Link
            href="/movies"
            className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white glass px-3 py-2 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Poster Container */}
          <div className="shrink-0 mx-auto lg:mx-0">
            <div className="relative w-48 sm:w-56 lg:w-72 aspect-poster rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-zinc-800">
              {movie.poster_path && (
                <Image
                  src={getPosterURL(movie.poster_path, "w500")}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 1024px) 224px, 288px"
                  className="object-cover"
                />
              )}
            </div>

            {/* Action Buttons */}
            <MediaActions
              tmdbId={movie.id}
              mediaType="movie"
              initialWatchlistStatus={initialWatchlistStatus}
              initialInFavorites={initialInFavorites}
            />

            {/* Watch Providers (Where to Stream) */}
            <WatchProviders providers={movie["watch/providers"]} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-4 lg:pt-12">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 leading-tight">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-zinc-400 italic text-lg mb-6">
                &quot;{movie.tagline}&quot;
              </p>
            )}

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8">
              {movie.vote_average > 0 && (
                <RatingBadge rating={movie.vote_average} size="lg" />
              )}
              {movie.runtime && movie.runtime > 0 && (
                <div className="flex items-center gap-2 text-zinc-300">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </div>
              )}
              {movie.release_date && (
                <div className="flex items-center gap-2 text-zinc-300">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  {formatYear(movie.release_date)}
                </div>
              )}
              {movie.original_language && (
                <div className="flex items-center gap-2 text-zinc-300">
                  <Globe className="w-4 h-4 text-zinc-500" />
                  <span className="uppercase">{movie.original_language}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {movie.genres.map((genre) => (
                  <GenreBadge key={genre.id} name={genre.name} href={`/movies?genre=${genre.id}`} />
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-white mb-3">{t.overview}</h2>
              <p className="text-zinc-300 leading-relaxed text-lg max-w-4xl">
                {movie.overview}
              </p>
            </div>

            {/* Director & Economics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12 py-6 border-y border-white/10">
              {director && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">{t.director}</p>
                  <p className="font-medium text-white">{director.name}</p>
                </div>
              )}
              {movie.budget > 0 && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">{t.budget}</p>
                  <p className="font-medium text-white">{formatCurrency(movie.budget)}</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">{t.revenue}</p>
                  <p className="font-medium text-white">{formatCurrency(movie.revenue)}</p>
                </div>
              )}
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div className="mb-12">
                <SectionHeader title={lang === "id" ? "Pemeran Utama" : "Top Cast"} />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {cast.map((actor) => (
                    <div key={actor.id} className="group">
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800 mb-3">
                        {actor.profile_path ? (
                          <Image
                            src={getProfileURL(actor.profile_path)}
                            alt={actor.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 20vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            No Image
                          </div>
                        )}
                      </div>
                      <p className="font-medium text-white text-sm line-clamp-1 group-hover:text-[#E50914] transition-colors">
                        {actor.name}
                      </p>
                      <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                        {actor.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trailer */}
            {trailer && (
              <div className="mb-12">
                <SectionHeader title={t.officialTrailer} />
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`}
                    title={trailer.name}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Sponsor Ad Banner */}
        <AdBanner />

        {/* AI Recommendations */}
        <AIRecommendations
          title={movie.title}
          overview={movie.overview}
          genres={movie.genres.map((g) => g.name).join(", ")}
        />

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <MovieCarousel
              title={t.youMightLike}
              items={recommendations}
              mediaType="movie"
            />
          </div>
        )}

        {/* Reviews Section */}
        <ReviewSection tmdbId={movie.id} mediaType="movie" />
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Movie",
            name: movie.title,
            image: getPosterURL(movie.poster_path, "original"),
            description: movie.overview,
            dateCreated: movie.release_date,
            director: director ? { "@type": "Person", name: director.name } : undefined,
            actor: cast.map((c) => ({ "@type": "Person", name: c.name })),
          }),
        }}
      />
    </div>
  );
}
