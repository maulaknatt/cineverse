"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { getBackdropURL } from "@/utils/tmdb-image";
import { formatYear, formatRating } from "@/utils/format";
import { GenreBadge } from "@/components/common/section-header";
import { MOVIE_GENRES } from "@/constants/genres";
import type { TMDBMovie } from "@/types/tmdb";

interface HeroBannerProps {
  movies: TMDBMovie[];
}

export function HeroBanner({ movies }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMuted] = useState(true);

  const currentMovie = movies[currentIndex];

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  }, [movies.length]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(goNext, 7000);
    return () => clearInterval(timer);
  }, [goNext]);

  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .slice(0, 3)
      .map((id) => MOVIE_GENRES.find((g) => g.id === id)?.name)
      .filter(Boolean) as string[];
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  if (!movies.length || !currentMovie) return null;

  return (
    <div className="relative w-full h-[85vh] min-h-[560px] max-h-[900px] overflow-hidden bg-zinc-900">
      {/* Background Images */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentMovie.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={getBackdropURL(currentMovie.backdrop_path, "original")}
            alt={currentMovie.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-[#09090B]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-end h-full pb-16 lg:pb-24 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovie.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {getGenreNames(currentMovie.genre_ids).map((genre) => (
                  <GenreBadge key={genre} name={genre} />
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-3">
                {currentMovie.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-400">
                    {formatRating(currentMovie.vote_average)}
                  </span>
                </div>
                <span className="text-zinc-400 text-sm">
                  {formatYear(currentMovie.release_date)}
                </span>
                <span className="text-zinc-400 text-sm">
                  {currentMovie.vote_count.toLocaleString()} votes
                </span>
              </div>

              {/* Overview */}
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6 max-w-xl">
                {currentMovie.overview}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/movies/${currentMovie.id}`}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-lg"
                >
                  <Play className="w-5 h-5 fill-black" />
                  Watch Now
                </Link>
                <Link
                  href={`/movies/${currentMovie.id}`}
                  className="flex items-center gap-2 px-6 py-3 glass text-white font-medium rounded-xl hover:bg-white/15 transition-all active:scale-95"
                >
                  <Info className="w-5 h-5" />
                  More Info
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10">
        <button
          onClick={goPrev}
          className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all"
          aria-label="Previous movie"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10">
        <button
          onClick={goNext}
          className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all"
          aria-label="Next movie"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Mute Button */}
      <div className="absolute bottom-8 right-6 z-10">
        <button
          className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Thumbnail Strip (right side, desktop) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2 z-10 mt-8">
        {movies.slice(0, 5).map((movie, i) => (
          <button
            key={movie.id}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            className={`relative w-16 h-24 rounded-lg overflow-hidden transition-all ${
              i === currentIndex
                ? "ring-2 ring-[#E50914] scale-110"
                : "opacity-50 hover:opacity-80"
            }`}
          >
            <Image
              src={getBackdropURL(movie.backdrop_path, "w300")}
              alt={movie.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
