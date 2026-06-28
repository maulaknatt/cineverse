"use client";

import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  featured?: boolean;
}

export default function BlogPage() {
  const posts: BlogPost[] = [
    {
      title: "How Gemini AI is Revolutionizing Movie Suggestions on CineVerse",
      excerpt:
        "Explore the mechanics of modern NLP and AI models in analyzing detailed plot summaries, mood descriptors, and stylistic genres to provide highly relevant film picks.",
      category: "Technology",
      date: "June 26, 2026",
      author: "CineVerse Engineering",
      readTime: "5 min read",
      featured: true,
    },
    {
      title: "Top 10 Hidden Sci-Fi Gems You Can Discover Today",
      excerpt:
        "Bored of mainstream recommendations? Our AI dug deep into the archives and surfaced these mind-bending independent science fiction masterpieces.",
      category: "Recommendations",
      date: "June 24, 2026",
      author: "Sarah Connor",
      readTime: "4 min read",
    },
    {
      title: "The Ultimate Summer Blockbuster Guide 2026",
      excerpt:
        "The heat is on, and so are the screens! From high-octane sequels to ambitious original entries, here is everything you need to watchlist this season.",
      category: "Cinematography",
      date: "June 20, 2026",
      author: "Marcus Aurelius",
      readTime: "8 min read",
    },
    {
      title: "Why Color Palettes Can Make or Break a Movie's Atmosphere",
      excerpt:
        "An in-depth analysis of color theory in modern cinema—ranging from Wes Anderson's symmetry to Denis Villeneuve's desert gradients.",
      category: "Theory",
      date: "June 15, 2026",
      author: "Lena Dunham",
      readTime: "6 min read",
    },
  ];

  const featuredPost = posts.find((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#E50914]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#E50914]/3 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-xs font-bold text-[#E50914]">
            <BookOpen className="w-3.5 h-3.5" />
            CineVerse Journal
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            The CineVerse <span className="text-[#E50914]">Blog</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Insights, theories, recommendation roundups, and technology updates from the intersection of AI and cinema.
          </p>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="group relative overflow-hidden rounded-3xl glass border border-white/10 bg-gradient-to-r from-zinc-900/40 via-zinc-950/40 to-[#E50914]/5 p-8 shadow-xl transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />
              
              <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-wider bg-[#E50914] text-white px-2 py-0.5 rounded font-black flex items-center gap-1">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      Featured
                    </span>
                    <span className="text-xs text-zinc-400 font-semibold">• {featuredPost.category}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-[#E50914] transition-colors leading-snug tracking-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-zinc-500 font-medium">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {featuredPost.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {featuredPost.date}
                    </span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>

                <div className="shrink-0 self-start md:self-center">
                  <span className="flex items-center gap-1 text-xs font-bold text-[#E50914] group-hover:translate-x-1 transition-transform cursor-pointer">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regularPosts.map((post, index) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="group glass rounded-2xl border border-white/5 hover:border-[#E50914]/20 p-6 bg-zinc-900/20 hover:bg-[#E50914]/[0.01] flex flex-col justify-between gap-6 transition-all duration-300 shadow-md relative overflow-hidden"
            >
              <div className="space-y-3">
                <span className="text-[10px] text-[#E50914] font-black uppercase tracking-wider">{post.category}</span>
                <h3 className="font-extrabold text-white text-sm leading-snug group-hover:text-[#E50914] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-semibold">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#E50914] group-hover:translate-x-1 transition-transform self-start cursor-pointer">
                  Read More <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
