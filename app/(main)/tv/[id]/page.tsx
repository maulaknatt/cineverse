import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, Globe, ArrowLeft, Tv } from "lucide-react";
import { getTVDetail } from "@/services/tmdb/tv";
import { getBackdropURL, getPosterURL, getProfileURL } from "@/utils/tmdb-image";
import { formatYear } from "@/utils/format";
import { GenreBadge, RatingBadge, SectionHeader } from "@/components/common/section-header";
import { MovieCarousel } from "@/components/common/movie-carousel";
import type { Metadata } from "next";

interface TVDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TVDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const show = await getTVDetail(id);
    return {
      title: show.name,
      description: show.overview,
      openGraph: {
        title: show.name,
        description: show.overview,
        images: [{ url: getBackdropURL(show.backdrop_path, "w1280") }],
      },
    };
  } catch {
    return { title: "TV Show Not Found" };
  }
}

export const revalidate = 86400; // 24 hours

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { MediaActions } from "@/components/common/media-actions";

export default async function TVDetailPage({ params }: TVDetailPageProps) {
  const { id } = await params;
  let show;

  try {
    show = await getTVDetail(id);
  } catch {
    notFound();
  }

  // Fetch initial watchlist/favorites state if user is logged in
  const { userId: clerkId } = await auth();
  let initialInWatchlist = false;
  let initialInFavorites = false;

  if (clerkId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        watchlistItems: {
          where: { tmdbId: show.id, mediaType: "tv" },
        },
        favorites: {
          where: { tmdbId: show.id, mediaType: "tv" },
        },
      },
    });

    if (dbUser) {
      initialInWatchlist = dbUser.watchlistItems.length > 0;
      initialInFavorites = dbUser.favorites.length > 0;
    }
  }

  const cast = show.credits?.cast.slice(0, 10) || [];
  const creators = show.created_by || [];
  const trailer = show.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const recommendations = show.recommendations?.results || [];

  return (
    <div className="min-h-screen pb-16">
      {/* Backdrop Hero */}
      <div className="relative w-full h-[70vh] min-h-[500px] bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {show.backdrop_path && (
            <Image
              src={getBackdropURL(show.backdrop_path, "original")}
              alt={show.name}
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
            href="/trending"
            className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white glass px-3 py-2 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Poster Container */}
          <div className="shrink-0 mx-auto lg:mx-0">
            <div className="relative w-48 sm:w-56 lg:w-72 aspect-poster rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-zinc-800">
              {show.poster_path && (
                <Image
                  src={getPosterURL(show.poster_path, "w500")}
                  alt={show.name}
                  fill
                  sizes="(max-width: 1024px) 224px, 288px"
                  className="object-cover"
                />
              )}
            </div>

            {/* Action Buttons */}
            <MediaActions
              tmdbId={show.id}
              mediaType="tv"
              initialInWatchlist={initialInWatchlist}
              initialInFavorites={initialInFavorites}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-4 lg:pt-12">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 leading-tight">
              {show.name}
            </h1>

            {show.tagline && (
              <p className="text-zinc-400 italic text-lg mb-6">
                &quot;{show.tagline}&quot;
              </p>
            )}

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8">
              {show.vote_average > 0 && (
                <RatingBadge rating={show.vote_average} size="lg" />
              )}
              {show.number_of_seasons && (
                <div className="flex items-center gap-2 text-zinc-300">
                  <Tv className="w-4 h-4 text-zinc-500" />
                  {show.number_of_seasons} {show.number_of_seasons === 1 ? "Season" : "Seasons"}
                </div>
              )}
              {show.number_of_episodes && (
                <div className="flex items-center gap-2 text-zinc-300">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  {show.number_of_episodes} Episodes
                </div>
              )}
              {show.first_air_date && (
                <div className="flex items-center gap-2 text-zinc-300">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  {formatYear(show.first_air_date)}
                </div>
              )}
              {show.original_language && (
                <div className="flex items-center gap-2 text-zinc-300">
                  <Globe className="w-4 h-4 text-zinc-500" />
                  <span className="uppercase">{show.original_language}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {show.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {show.genres.map((genre) => (
                  <GenreBadge key={genre.id} name={genre.name} />
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-white mb-3">Overview</h2>
              <p className="text-zinc-300 leading-relaxed text-lg max-w-4xl">
                {show.overview}
              </p>
            </div>

            {/* Creators & Seasons info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12 py-6 border-y border-white/10">
              {creators.length > 0 && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Creator</p>
                  <p className="font-medium text-white">
                    {creators.map((c) => c.name).join(", ")}
                  </p>
                </div>
              )}
              {show.status && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Status</p>
                  <p className="font-medium text-white">{show.status}</p>
                </div>
              )}
              {show.type && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Type</p>
                  <p className="font-medium text-white">{show.type}</p>
                </div>
              )}
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div className="mb-12">
                <SectionHeader title="Top Cast" />
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
                <SectionHeader title="Official Trailer" />
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

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <MovieCarousel
              title="You Might Also Like"
              items={recommendations}
              mediaType="tv"
            />
          </div>
        )}
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TVSeries",
            name: show.name,
            image: getPosterURL(show.poster_path, "original"),
            description: show.overview,
            dateCreated: show.first_air_date,
            actor: cast.map((c) => ({ "@type": "Person", name: c.name })),
          }),
        }}
      />
    </div>
  );
}
