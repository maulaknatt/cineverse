import Link from "next/link";
import { discoverMovies } from "@/services/tmdb/movies";
import { MovieCard } from "@/components/common/movie-card";
import { getMovieGenres } from "@/constants/genres";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies",
  description: "Browse thousands of movies. Filter by genre, year, rating, and more.",
};

export const revalidate = 3600;

interface MoviesPageProps {
  searchParams: Promise<{
    filter?: string;
    genre?: string;
    year?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const tmdbLang = lang === "id" ? "id-ID" : "en-US";
  const genres = getMovieGenres(lang);

  const params = await searchParams;
  const page = Number(params.page || 1);
  const genreId = params.genre ? Number(params.genre) : undefined;
  const year = params.year ? Number(params.year) : undefined;
  const sortBy = params.sort || "popularity.desc";

  const movies = await discoverMovies({
    page,
    sort_by: sortBy,
    ...(genreId ? { with_genres: String(genreId) } : {}),
    ...(year ? { primary_release_year: year } : {}),
  }, tmdbLang);

  const selectedGenre = genres.find((g) => g.id === genreId);

  const sortOptions =
    lang === "id"
      ? [
          { value: "popularity.desc", label: "Terpopuler" },
          { value: "vote_average.desc", label: "Peringkat Teratas" },
          { value: "primary_release_date.desc", label: "Terbaru" },
          { value: "revenue.desc", label: "Laris (Box Office)" },
        ]
      : [
          { value: "popularity.desc", label: "Most Popular" },
          { value: "vote_average.desc", label: "Top Rated" },
          { value: "primary_release_date.desc", label: "Newest" },
          { value: "revenue.desc", label: "Box Office" },
        ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {selectedGenre
              ? lang === "id"
                ? `Film ${selectedGenre.name}`
                : `${selectedGenre.name} Movies`
              : lang === "id"
              ? "🎬 Jelajahi Film"
              : "🎬 Browse Movies"}
          </h1>
          <p className="text-zinc-400">
            {movies.total_results.toLocaleString()}{" "}
            {lang === "id" ? "film tersedia" : "movies available"}
          </p>
        </div>

        {/* Genre Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          <Link
            href="/movies"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
              !genreId
                ? "bg-[#E50914] text-white"
                : "glass border border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            {lang === "id" ? "Semua" : "All"}
          </Link>
          {genres.slice(0, 10).map((genre) => (
            <Link
              key={genre.id}
              href={`/movies?genre=${genre.id}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
                genreId === genre.id
                  ? "bg-[#E50914] text-white"
                  : "glass border border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              {genre.name}
            </Link>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
          <span className="text-sm text-zinc-400 shrink-0">
            {lang === "id" ? "Urutkan:" : "Sort by:"}
          </span>
          <div className="flex gap-2">
            {sortOptions.map(({ value, label }) => (
              <Link
                key={value}
                href={`/movies?${new URLSearchParams({ ...params, sort: value }).toString()}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  sortBy === value
                    ? "bg-[#E50914] text-white"
                    : "glass border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.results.map((movie, i) => (
            <MovieCard
              key={movie.id}
              media={movie}
              mediaType="movie"
              priority={i < 6}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {page > 1 && (
            <Link
              href={`/movies?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
              className="px-4 py-2 glass rounded-lg border border-white/10 text-sm text-white hover:bg-white/10 transition-all"
            >
              {lang === "id" ? "← Sebelumnya" : "← Previous"}
            </Link>
          )}
          <span className="text-sm text-zinc-400">
            {lang === "id"
              ? `Halaman ${page} dari ${Math.min(movies.total_pages, 500)}`
              : `Page ${page} of ${Math.min(movies.total_pages, 500)}`}
          </span>
          {page < movies.total_pages && (
            <Link
              href={`/movies?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
              className="px-4 py-2 glass rounded-lg border border-white/10 text-sm text-white hover:bg-white/10 transition-all"
            >
              {lang === "id" ? "Selanjutnya →" : "Next →"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
