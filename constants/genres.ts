import type { TMDBGenre } from "@/types/tmdb";

export const MOVIE_GENRES: TMDBGenre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export const TV_GENRES: TMDBGenre[] = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

// Genre emoji mapping for visual flair
export const GENRE_EMOJI: Record<number, string> = {
  28: "💥",
  12: "🗺️",
  16: "🎨",
  35: "😂",
  80: "🔫",
  99: "🎥",
  18: "🎭",
  10751: "👨‍👩‍👧‍👦",
  14: "🧙‍♂️",
  36: "📜",
  27: "👻",
  10402: "🎵",
  9648: "🔍",
  10749: "❤️",
  878: "🚀",
  53: "😱",
  10752: "⚔️",
  37: "🤠",
  10759: "🎬",
  10765: "🌌",
};

// Genre gradient colors
export const GENRE_COLORS: Record<number, string> = {
  28: "from-red-600 to-orange-600",
  12: "from-green-600 to-emerald-600",
  16: "from-purple-600 to-pink-600",
  35: "from-yellow-500 to-orange-500",
  80: "from-gray-600 to-zinc-600",
  99: "from-blue-600 to-cyan-600",
  18: "from-indigo-600 to-violet-600",
  10751: "from-pink-500 to-rose-500",
  14: "from-violet-600 to-purple-600",
  36: "from-amber-600 to-yellow-600",
  27: "from-red-900 to-red-700",
  10402: "from-pink-600 to-fuchsia-600",
  9648: "from-slate-600 to-gray-600",
  10749: "from-rose-500 to-pink-500",
  878: "from-blue-700 to-indigo-700",
  53: "from-orange-700 to-red-700",
  10752: "from-zinc-700 to-stone-700",
  37: "from-amber-700 to-orange-700",
  10759: "from-red-600 to-orange-500",
  10765: "from-blue-600 to-violet-600",
};

// Genre translations mapping
export const GENRE_TRANSLATIONS: Record<number, { en: string; id: string }> = {
  28: { en: "Action", id: "Aksi" },
  12: { en: "Adventure", id: "Petualangan" },
  16: { en: "Animation", id: "Animasi" },
  35: { en: "Comedy", id: "Komedi" },
  80: { en: "Crime", id: "Kriminal" },
  99: { en: "Documentary", id: "Dokumenter" },
  18: { en: "Drama", id: "Drama" },
  10751: { en: "Family", id: "Keluarga" },
  14: { en: "Fantasy", id: "Fantasi" },
  36: { en: "History", id: "Sejarah" },
  27: { en: "Horror", id: "Horor" },
  10402: { en: "Music", id: "Musik" },
  9648: { en: "Mystery", id: "Misteri" },
  10749: { en: "Romance", id: "Romantis" },
  878: { en: "Science Fiction", id: "Fiksi Ilmiah" },
  10770: { en: "TV Movie", id: "Film TV" },
  53: { en: "Thriller", id: "Thriller" },
  10752: { en: "War", id: "Perang" },
  37: { en: "Western", id: "Barat" },
  // TV Genres
  10759: { en: "Action & Adventure", id: "Aksi & Petualangan" },
  10762: { en: "Kids", id: "Anak-anak" },
  10763: { en: "News", id: "Berita" },
  10764: { en: "Reality", id: "Realitas" },
  10765: { en: "Sci-Fi & Fantasy", id: "Fiksi Ilmiah & Fantasi" },
  10766: { en: "Soap", id: "Sinetron" },
  10767: { en: "Talk", id: "Bincang-bincang" },
  10768: { en: "War & Politics", id: "Perang & Politik" },
};

export function getMovieGenres(lang: string): TMDBGenre[] {
  return MOVIE_GENRES.map((g) => ({
    id: g.id,
    name: GENRE_TRANSLATIONS[g.id]?.[lang === "id" ? "id" : "en"] || g.name,
  }));
}

export function getTVGenres(lang: string): TMDBGenre[] {
  return TV_GENRES.map((g) => ({
    id: g.id,
    name: GENRE_TRANSLATIONS[g.id]?.[lang === "id" ? "id" : "en"] || g.name,
  }));
}

