"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "@/components/common/movie-card";
import { SectionHeader } from "@/components/common/section-header";
import type { TMDBMovie, TMDBTVShow, MediaType } from "@/types/tmdb";
import { cn } from "@/utils/cn";

type MediaItem = TMDBMovie | TMDBTVShow;

interface MovieCarouselProps {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  mediaType?: MediaType;
  seeAllHref?: string;
  className?: string;
}

export function MovieCarousel({
  title,
  subtitle,
  items,
  mediaType = "movie",
  seeAllHref,
  className,
}: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <section className={cn("w-full", className)}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          href={seeAllHref}
        />

        <div className="relative group/carousel">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full bg-[#18181B] border border-white/10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 hover:bg-[#E50914] transition-all shadow-xl"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto no-scrollbar pb-2"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]"
              >
                <MovieCard
                  media={item}
                  mediaType={mediaType}
                  priority={index < 5}
                />
              </motion.div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full bg-[#18181B] border border-white/10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 hover:bg-[#E50914] transition-all shadow-xl"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Fade Edges */}
          <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-[#09090B] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-[#09090B] to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
