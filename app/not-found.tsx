"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E50914]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg relative z-10"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="mb-4"
        >
          <span className="text-8xl sm:text-9xl lg:text-[160px] font-black leading-none gradient-text">
            404
          </span>
        </motion.div>

        {/* Film Icon */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#E50914]/20 flex items-center justify-center border border-[#E50914]/30">
            <Film className="w-8 h-8 text-[#E50914]" />
          </div>
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Scene Not Found
        </h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          The page you&apos;re looking for seems to have been cut from the final edit.
          Let&apos;s get you back to discovering great films.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#b20710] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-red-900/30 active:scale-95"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            href="/search"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 glass border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all active:scale-95"
          >
            <Search className="w-5 h-5" />
            Search Movies
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
