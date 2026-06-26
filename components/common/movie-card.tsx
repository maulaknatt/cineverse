"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Play, Heart, BookMarked, Eye } from "lucide-react";
import { cn } from "@/utils/cn";
import { getPosterURL } from "@/utils/tmdb-image";
import { formatYear, formatRating, getRatingColor } from "@/utils/format";
import type { TMDBMovie, TMDBTVShow, MediaType } from "@/types/tmdb";

type CardMedia = (TMDBMovie | TMDBTVShow) & { media_type?: MediaType };

interface MovieCardProps {
  media: CardMedia;
  mediaType?: MediaType;
  className?: string;
  priority?: boolean;
  variant?: "default" | "compact" | "wide";
}

export function MovieCard({
  media,
  mediaType = "movie",
  className,
  priority = false,
  variant = "default",
}: MovieCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const title = "title" in media ? media.title : media.name;
  const releaseDate =
    "release_date" in media ? media.release_date : media.first_air_date;
  const type = (media as CardMedia).media_type ?? mediaType;
  const href = `/${type === "tv" ? "tv" : "movies"}/${media.id}`;

  const rating = media.vote_average;
  const posterPath = media.poster_path;

  if (variant === "compact") {
    return (
      <Link href={href} className={cn("flex gap-3 group", className)}>
        <div className="relative w-12 h-18 rounded-lg overflow-hidden shrink-0 aspect-poster bg-zinc-800">
          {posterPath ? (
            <Image
              src={getPosterURL(posterPath, "w185")}
              alt={title}
              fill
              sizes="48px"
              className="object-cover"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <Eye className="w-4 h-4 text-zinc-600" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 py-1">
          <p className="text-sm font-medium text-white line-clamp-1 group-hover:text-[#E50914] transition-colors">
            {title}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">{formatYear(releaseDate)}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className={cn("text-xs font-medium", getRatingColor(rating))}>
              {formatRating(rating)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      className={cn("group relative", className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={href} className="block">
        {/* Poster Container */}
        <div className="relative aspect-poster rounded-xl overflow-hidden bg-zinc-800 shadow-lg">
          {/* Poster Image */}
          {posterPath ? (
            <Image
              src={getPosterURL(posterPath, "w342")}
              alt={title}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 200px"
              className={cn(
                "object-cover transition-all duration-500",
                isImageLoaded ? "opacity-100" : "opacity-0",
                isHovered && "scale-105"
              )}
              onLoad={() => setIsImageLoaded(true)}
              priority={priority}
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <Eye className="w-8 h-8 text-zinc-600" />
            </div>
          )}

          {/* Shimmer skeleton while loading */}
          {!isImageLoaded && posterPath && (
            <div className="absolute inset-0 shimmer" />
          )}

          {/* Gradient Overlay on Hover */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
          />

          {/* Play Button on Hover */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </motion.div>

          {/* Rating Badge */}
          {rating > 0 && (
            <div className="absolute top-2 left-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className={cn("text-xs font-semibold", getRatingColor(rating))}>
                  {formatRating(rating)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons on Hover */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-2 right-2 flex gap-1.5"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                // TODO: Add to watchlist
              }}
              className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-[#E50914] transition-colors border border-white/10"
              aria-label="Add to Watchlist"
            >
              <BookMarked className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                // TODO: Add to favorites
              }}
              className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-[#E50914] transition-colors border border-white/10"
              aria-label="Add to Favorites"
            >
              <Heart className="w-4 h-4 text-white" />
            </button>
          </motion.div>
        </div>

        {/* Info Below Poster */}
        <div className="mt-3 px-0.5">
          <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-[#E50914] transition-colors">
            {title}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">{formatYear(releaseDate)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
