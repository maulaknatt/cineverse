import Link from "next/link";
import { notFound } from "next/navigation";
import { discoverMovies } from "@/services/tmdb/movies";
import { discoverTV } from "@/services/tmdb/tv";
import { MovieCard } from "@/components/common/movie-card";
import { MOVIE_GENRES, TV_GENRES } from "@/constants/genres";
import type { Metadata } from "next";

interface GenreDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; page?: string }>;
}

export async function generateMetadata({ params }: GenreDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const genreId = Number(id);
  const movieGenre = MOVIE_GENRES.find((g) => g.id === genreId);
  const tvGenre = TV_GENRES.find((g) => g.id === genreId);
  const name = movieGenre?.name || tvGenre?.name || "Genre";

  return {
    title: `${name} Movies & Series`,
    description: `Browse movies and Series in the ${name} genre.`,
  };
}

export const revalidate = 3600; // 1 hour ISR

export default async function GenreDetailPage({ params, searchParams }: GenreDetailPageProps) {
  const { id } = await params;
  const genreId = Number(id);

  const search = await searchParams;
  const page = Number(search.page || 1);

  // Check if genre exists in movies/TV
  const hasMovieGenre = MOVIE_GENRES.some((g) => g.id === genreId);
  const hasTVGenre = TV_GENRES.some((g) => g.id === genreId);

  if (!hasMovieGenre && !hasTVGenre) {
    notFound();
  }

  // Determine current active media type tab
  // Default to tv if it only has TV genre, or if type=tv query param is set and has tv genre
  const defaultType = hasMovieGenre ? "movie" : "tv";
  const activeType = search.type === "tv" && hasTVGenre ? "tv" : (search.type === "movie" && hasMovieGenre ? "movie" : defaultType);

  const genreName = activeType === "movie"
    ? MOVIE_GENRES.find((g) => g.id === genreId)?.name
    : TV_GENRES.find((g) => g.id === genreId)?.name;

  let results = [];
  let totalPages = 1;
  let totalResults = 0;

  if (activeType === "movie") {
    const res = await discoverMovies({
      with_genres: String(genreId),
      page,
      sort_by: "popularity.desc",
    });
    results = res.results;
    totalPages = res.total_pages;
    totalResults = res.total_results;
  } else {
    const res = await discoverTV({
      with_genres: String(genreId),
      page,
      sort_by: "popularity.desc",
    });
    results = res.results;
    totalPages = res.total_pages;
    totalResults = res.total_results;
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="text-sm text-[#E50914] font-semibold tracking-wider uppercase mb-1.5">
            Genre Category
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            {genreName}
          </h1>
          <p className="text-zinc-400">
            {totalResults.toLocaleString()} {activeType === "movie" ? "movies" : "Series"} available
          </p>
        </div>

        {/* Media Type Tabs */}
        {hasMovieGenre && hasTVGenre && (
          <div className="flex mb-8">
            <div className="flex p-1 glass rounded-xl border border-white/10">
              <Link
                href={`/genres/${genreId}?type=movie`}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeType === "movie"
                    ? "bg-[#E50914] text-white shadow-lg shadow-red-950/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Movies
              </Link>
              <Link
                href={`/genres/${genreId}?type=tv`}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeType === "tv"
                    ? "bg-[#E50914] text-white shadow-lg shadow-red-955/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Series
              </Link>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item, i) => (
              <MovieCard
                key={item.id}
                media={item}
                mediaType={activeType}
                priority={i < 6}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🎬</span>
            <p className="text-zinc-400">No content found in this genre.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {page > 1 && (
              <Link
                href={`/genres/${genreId}?${new URLSearchParams({ ...search, page: String(page - 1) }).toString()}`}
                className="px-4 py-2 glass rounded-lg border border-white/10 text-sm text-white hover:bg-white/10 transition-all"
              >
                ← Previous
              </Link>
            )}
            <span className="text-sm text-zinc-400">
              Page {page} of {Math.min(totalPages, 500)}
            </span>
            {page < totalPages && (
              <Link
                href={`/genres/${genreId}?${new URLSearchParams({ ...search, page: String(page + 1) }).toString()}`}
                className="px-4 py-2 glass rounded-lg border border-white/10 text-sm text-white hover:bg-white/10 transition-all"
              >
                Next →
              </Link>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
