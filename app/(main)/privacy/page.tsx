"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Lock, FileText } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Eye,
      title: "1. Information We Collect",
      content:
        "We collect information you provide directly to us, such as when you create an account, update your profile, add items to your watchlist, write reviews, or chat with CineBot. This may include your username, name, email address, profile picture, and interaction records.",
    },
    {
      icon: Shield,
      title: "2. How We Use Information",
      content:
        "We use the collected information to personalize your CineVerse experience, process premium upgrades, run AI recommendation analysis through Google Gemini, maintain platform security, and analyze viewing habits for dashboard statistics.",
    },
    {
      icon: Lock,
      title: "3. Data Security & Storage",
      content:
        "We implement industry-standard security measures to safeguard your personal data. We utilize Clerk for secure authentication and Supabase PostgreSQL for encrypted transactional data storage. We do not sell your personal data to third parties.",
    },
    {
      icon: FileText,
      title: "4. Third-Party Integrations",
      content:
        "CineVerse utilizes TMDB (The Movie Database) for content metadata, Clerk for user management, and Google Gemini Flash API for recommendations. Each third-party service processes information according to their own privacy policies.",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#E50914]/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#E50914]/3 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-xs font-bold text-[#E50914]">
            <Shield className="w-3.5 h-3.5" />
            Security first
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Privacy <span className="text-[#E50914]">Policy</span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Last Updated: June 28, 2026
          </p>
        </motion.div>

        <div className="space-y-6 mb-12">
          {sections.map((sec, index) => (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-2xl border border-white/5 p-6 sm:p-8 bg-zinc-900/10 hover:border-white/10 transition-colors"
            >
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center text-[#E50914] shrink-0">
                  <sec.icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-base tracking-tight">{sec.title}</h3>
                  <p className="text-zinc-300 text-xs leading-relaxed">{sec.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-zinc-500 text-[10px] leading-relaxed max-w-md mx-auto"
        >
          If you have any questions or concerns regarding our privacy practices, please contact us at{" "}
          <span className="text-white font-medium">privacy@cineverse.com</span>.
        </motion.div>
      </div>
    </div>
  );
}
