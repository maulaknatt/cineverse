"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MOVIE_GENRES, TV_GENRES, GENRE_EMOJI, GENRE_COLORS } from "@/constants/genres";

export default function GenresPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            🎭 Browse Genres
          </h1>
          <p className="text-zinc-400 max-w-xl">
            Explore movies and TV shows filtered by your favorite genres.
          </p>
        </div>

        {/* Section 1 - Movie Genres */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2 pb-2 border-b border-white/5">
            🎬 Movie Kategori
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {MOVIE_GENRES.map((genre) => (
              <motion.div key={genre.id} variants={cardVariants}>
                <Link
                  href={`/genres/${genre.id}`}
                  className={`
                    relative flex flex-col items-center justify-center gap-3
                    h-28 rounded-2xl text-center overflow-hidden
                    bg-gradient-to-br ${GENRE_COLORS[genre.id] || "from-zinc-700 to-zinc-600"}
                    hover:scale-105 hover:shadow-xl hover:shadow-black/40
                    transition-all duration-300 group
                  `}
                >
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                  <span className="relative text-3xl group-hover:scale-110 transition-transform duration-300">
                    {GENRE_EMOJI[genre.id] || "🎬"}
                  </span>
                  <span className="relative text-sm font-semibold text-white drop-shadow-md">
                    {genre.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Section 2 - TV Genres */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2 pb-2 border-b border-white/5">
            📺 Series Kategori
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {TV_GENRES.map((genre) => (
              <motion.div key={genre.id} variants={cardVariants}>
                <Link
                  href={`/genres/${genre.id}?type=tv`}
                  className={`
                    relative flex flex-col items-center justify-center gap-3
                    h-28 rounded-2xl text-center overflow-hidden
                    bg-gradient-to-br ${GENRE_COLORS[genre.id] || "from-zinc-700 to-zinc-600"}
                    hover:scale-105 hover:shadow-xl hover:shadow-black/40
                    transition-all duration-300 group
                  `}
                >
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                  <span className="relative text-3xl group-hover:scale-110 transition-transform duration-300">
                    {GENRE_EMOJI[genre.id] || "📺"}
                  </span>
                  <span className="relative text-sm font-semibold text-white drop-shadow-md">
                    {genre.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
