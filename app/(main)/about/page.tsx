"use client";

import { motion } from "framer-motion";
import { Sparkles, Film, Shield, Users, Heart } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Discovery",
      desc: "Get personalized movie recommendations powered by Google Gemini based on your mood, style, or themes.",
    },
    {
      icon: Film,
      title: "Rich Cinematic Data",
      desc: "Browse a database of millions of movies, TV shows, cast info, trailers, and reviews integrated with TMDB.",
    },
    {
      icon: Shield,
      title: "Advanced Tracking",
      desc: "Manage your watchlist with flexible statuses and analyze your viewing patterns with premium statistics.",
    },
    {
      icon: Users,
      title: "Community & Reviews",
      desc: "Share your cinematic thoughts, read community reviews, and discuss plots with other movie buffs.",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#E50914]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#E50914]/3 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-xs font-bold text-[#E50914]">
            <Sparkles className="w-3.5 h-3.5" />
            Our Vision
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            About Cine<span className="text-[#E50914]">Verse</span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We are on a mission to reshape movie discovery. No more endless scrolling — CineVerse uses state-of-the-art AI to connect you with stories that match your soul.
          </p>
        </motion.div>

        {/* Narrative Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-3xl border border-white/10 p-8 sm:p-10 mb-12 bg-gradient-to-r from-zinc-900/50 to-zinc-950/50 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">The CineVerse Story</h2>
          <p className="text-zinc-300 text-sm leading-relaxed mb-4">
            CineVerse was founded in 2025 by a small team of cinephiles and developers who grew frustrated with generic algorithm suggestions. We wanted a way to search for movies using natural language, expressions of mood, and detailed themes rather than just plain genre tags.
          </p>
          <p className="text-zinc-300 text-sm leading-relaxed">
            By leveraging Next.js and Google Gemini AI, we built a modern platform that understands your requirements and returns beautiful, rich recommendations alongside analytics that help you appreciate your viewing habits.
          </p>
        </motion.div>

        {/* Grid Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {features.map((feat, index) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="glass rounded-2xl border border-white/5 hover:border-[#E50914]/20 p-6 bg-zinc-900/25 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center text-[#E50914] mb-4 group-hover:scale-110 transition-transform">
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">{feat.title}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center py-6 border-t border-white/5 flex items-center justify-center gap-1.5 text-zinc-500 text-xs"
        >
          Made with <Heart className="w-3.5 h-3.5 text-[#E50914] fill-current animate-pulse" /> by CineVerse Team
        </motion.div>
      </div>
    </div>
  );
}
