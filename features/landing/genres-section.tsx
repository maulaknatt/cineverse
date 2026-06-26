"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MOVIE_GENRES, GENRE_EMOJI, GENRE_COLORS } from "@/constants/genres";
import { SectionHeader } from "@/components/common/section-header";

export function GenresSection() {
  return (
    <section className="w-full py-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Browse by Genre"
          subtitle="Find films that match your taste"
          href="/genres"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {MOVIE_GENRES.slice(0, 18).map((genre, index) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <Link
                href={`/genres/${genre.id}`}
                className={`
                  relative flex flex-col items-center justify-center gap-2
                  h-24 rounded-2xl text-center overflow-hidden
                  bg-gradient-to-br ${GENRE_COLORS[genre.id] || "from-zinc-700 to-zinc-600"}
                  hover:scale-105 hover:shadow-lg hover:shadow-black/30
                  transition-all duration-300 group
                `}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <span className="relative text-2xl">{GENRE_EMOJI[genre.id] || "🎬"}</span>
                <span className="relative text-xs font-semibold text-white drop-shadow">
                  {genre.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
