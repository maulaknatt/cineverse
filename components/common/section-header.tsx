"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("flex items-end justify-between mb-6", className)}
    >
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
        {subtitle && (
          <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-[#E50914] transition-colors group shrink-0"
        >
          See all
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </motion.div>
  );
}

interface GenreBadgeProps {
  name: string;
  className?: string;
  href?: string;
}

export function GenreBadge({ name, className, href }: GenreBadgeProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        "bg-white/10 text-zinc-300 hover:bg-white/15 hover:text-white transition-colors",
        "border border-white/10",
        className
      )}
    >
      {name}
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RatingBadge({ rating, size = "md", className }: RatingBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const ratingColor =
    rating >= 7.5
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : rating >= 6.0
      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      : rating >= 4.0
      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg font-semibold border",
        sizeClasses[size],
        ratingColor,
        className
      )}
    >
      ★ {rating.toFixed(1)}
    </span>
  );
}
