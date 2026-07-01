import Link from "next/link";
import { discoverTV } from "@/services/tmdb/tv";
import { MovieCard } from "@/components/common/movie-card";
import { getTVGenres } from "@/constants/genres";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Series",
  description: "Browse thousands of Series. Filter by genre, year, rating, and more.",
};

export const revalidate = 3600; // 1 hour ISR

interface TVPageProps {
  searchParams: Promise<{
    filter?: string;
    genre?: string;
    year?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function TVPage({ searchParams }: TVPageProps) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const tmdbLang = lang === "id" ? "id-ID" : "en-US";
  const genres = getTVGenres(lang);

  const params = await searchParams;
  const page = Number(params.page || 1);
  const genreId = params.genre ? Number(params.genre) : undefined;
  const year = params.year ? Number(params.year) : undefined;
  const sortBy = params.sort || "popularity.desc";

  const tvShows = await discoverTV({
    page,
    sort_by: sortBy,
    ...(genreId ? { with_genres: String(genreId) } : {}),
    ...(year ? { first_air_date_year: year } : {}),
  }, tmdbLang);

  const selectedGenre = genres.find((g) => g.id === genreId);

  const sortOptions =
    lang === "id"
      ? [
          { value: "popularity.desc", label: "Terpopuler" },
          { value: "vote_average.desc", label: "Peringkat Teratas" },
          { value: "first_air_date.desc", label: "Terbaru" },
        ]
      : [
          { value: "popularity.desc", label: "Most Popular" },
          { value: "vote_average.desc", label: "Top Rated" },
          { value: "first_air_date.desc", label: "Newest" },
        ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {selectedGenre
              ? lang === "id"
                ? `Serial ${selectedGenre.name}`
                : `${selectedGenre.name} Series`
              : lang === "id"
              ? "📺 Jelajahi Serial"
              : "📺 Browse Series"}
          </h1>
          <p className="text-zinc-400">
            {tvShows.total_results.toLocaleString()}{" "}
            {lang === "id" ? "serial tersedia" : "Series available"}
          </p>
        </div>

        {/* Genre Filter (Scrollable) */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          <Link
            href="/tv"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
              !genreId
                ? "bg-[#E50914] text-white"
                : "glass border border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            {lang === "id" ? "Semua" : "All"}
          </Link>
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/tv?genre=${genre.id}`}
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

        {/* Sort (Scrollable) */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
          <span className="text-sm text-zinc-400 shrink-0">
            {lang === "id" ? "Urutkan:" : "Sort by:"}
          </span>
          <div className="flex gap-2">
            {sortOptions.map(({ value, label }) => (
              <Link
                key={value}
                href={`/tv?${new URLSearchParams({ ...params, sort: value }).toString()}`}
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
        {tvShows.results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {tvShows.results.map((show, i) => (
              <MovieCard
                key={show.id}
                media={show}
                mediaType="tv"
                priority={i < 6}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">📺</span>
            <p className="text-zinc-400">
              {lang === "id"
                ? "Tidak ada serial yang cocok dengan kriteria."
                : "No Series found matching criteria."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {tvShows.total_pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {page > 1 && (
              <Link
                href={`/tv?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                className="px-4 py-2 glass rounded-lg border border-white/10 text-sm text-white hover:bg-white/10 transition-all"
              >
                {lang === "id" ? "← Sebelumnya" : "← Previous"}
              </Link>
            )}
            <span className="text-sm text-zinc-400">
              {lang === "id"
                ? `Halaman ${page} dari ${Math.min(tvShows.total_pages, 500)}`
                : `Page ${page} of ${Math.min(tvShows.total_pages, 500)}`}
            </span>
            {page < tvShows.total_pages && (
              <Link
                href={`/tv?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                className="px-4 py-2 glass rounded-lg border border-white/10 text-sm text-white hover:bg-white/10 transition-all"
              >
                {lang === "id" ? "Selanjutnya →" : "Next →"}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
