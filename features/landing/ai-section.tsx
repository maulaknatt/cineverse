"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, MessageSquare, Heart, Zap } from "lucide-react";
import { AI_PROMPT_EXAMPLES, MOOD_OPTIONS } from "@/constants/ai-prompts";
import { useTranslation } from "@/hooks/use-translation";

export function AISection() {
  const { lang } = useTranslation();

  const title =
    lang === "en" ? (
      <>
        Find Your Next <span className="gradient-text">Favorite Film</span> with AI
      </>
    ) : (
      <>
        Temukan Film <span className="gradient-text">Favorit Anda</span> dengan AI
      </>
    );

  const subtitle =
    lang === "en"
      ? "Describe your mood, mention a movie you love, or ask CineBot anything. Our Gemini-powered AI understands context and gives you personalized recommendations in seconds."
      : "Jelaskan suasana hati Anda, sebutkan film yang Anda sukai, atau tanyakan apa pun ke CineBot. AI bertenaga Gemini kami memahami konteks dan memberi Anda rekomendasi pribadi dalam hitungan detik.";

  const features =
    lang === "en"
      ? [
          { icon: MessageSquare, label: "Natural Language Chat" },
          { icon: Heart, label: "Mood-Based Picks" },
          { icon: Zap, label: "Instant Results" },
        ]
      : [
          { icon: MessageSquare, label: "Obrolan Bahasa Alami" },
          { icon: Heart, label: "Pilihan Sesuai Mood" },
          { icon: Zap, label: "Hasil Instan" },
        ];

  const buttonText = lang === "en" ? "Try AI Recommendation" : "Coba Rekomendasi AI";
  const badgeText = lang === "en" ? "AI-Powered Discovery" : "Penemuan Berbasis AI";

  const aiGreeting =
    lang === "en"
      ? "Hello! 👋 I'm CineBot. Tell me your mood or a favorite movie, and I will recommend the best movies for you!"
      : "Halo! 👋 Aku CineBot. Ceritakan mood kamu atau film favoritmu, dan aku akan rekomendasikan film terbaik untukmu!";

  const userMsg =
    lang === "en"
      ? "I like Interstellar. Recommend similar movies! 🚀"
      : "Aku suka Interstellar. Rekomendasikan film serupa! 🚀";

  const aiResponseHeader =
    lang === "en"
      ? "You like Interstellar? Here are my recommendations:"
      : "Kamu suka Interstellar? Berikut rekomendasiku:";

  const tryAskingText = lang === "en" ? "Try asking:" : "Coba tanyakan:";
  const moodBadgeText = lang === "en" ? "mood-based" : "sesuai mood";

  return (
    <section className="w-full py-16 lg:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E50914]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
              <Sparkles className="w-4 h-4 text-[#E50914]" />
              <span className="text-sm font-medium text-[#E50914]">{badgeText}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              {title}
            </h2>

            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-8">
              {subtitle}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10"
                >
                  <Icon className="w-4 h-4 text-[#E50914]" />
                  <span className="text-sm text-zinc-300">{label}</span>
                </div>
              ))}
            </div>

            <Link
              href="/ai"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#b20710] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-red-900/30 active:scale-95 group"
            >
              <Sparkles className="w-5 h-5" />
              {buttonText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right — AI Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Fake Chat UI */}
            <div className="relative glass rounded-2xl border border-white/10 p-4 shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-9 h-9 rounded-xl bg-[#E50914] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">CineBot</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                    Online
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="py-4 space-y-3">
                {/* AI message */}
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E50914]/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%]">
                    <p className="text-sm text-zinc-200">{aiGreeting}</p>
                  </div>
                </div>

                {/* User message */}
                <div className="flex gap-2 justify-end">
                  <div className="bg-[#E50914] rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%]">
                    <p className="text-sm text-white">{userMsg}</p>
                  </div>
                </div>

                {/* AI response */}
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E50914]/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%]">
                    <p className="text-sm text-zinc-200 mb-2">{aiResponseHeader}</p>
                    {["Arrival (2016)", "Inception (2010)", "2001: A Space Odyssey"].map((film) => (
                      <div key={film} className="flex items-center gap-2 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
                        <span className="text-sm text-white font-medium">{film}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E50914]/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt Examples */}
              <div className="border-t border-white/10 pt-3">
                <p className="text-xs text-zinc-500 mb-2">{tryAskingText}</p>
                <div className="flex flex-wrap gap-2">
                  {AI_PROMPT_EXAMPLES.slice(0, 3).map((ex) => (
                    <button
                      key={ex.id}
                      className="text-xs px-2.5 py-1.5 rounded-lg glass border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 transition-all"
                    >
                      {ex.emoji} {ex.prompt.slice(0, 28)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating mood pills */}
            <div className="absolute -top-4 -right-4 hidden sm:block">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="glass rounded-xl px-3 py-2 border border-white/10 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  {MOOD_OPTIONS.slice(0, 4).map((mood) => (
                    <span key={mood.value} className="text-xl">
                      {mood.emoji}
                    </span>
                  ))}
                  <span className="text-xs text-zinc-400">{moodBadgeText}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
