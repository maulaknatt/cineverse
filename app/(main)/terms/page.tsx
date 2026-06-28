"use client";

import { motion } from "framer-motion";
import { Scale, Users, CreditCard, Sparkles } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: Scale,
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using CineVerse, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform or features.",
    },
    {
      icon: Users,
      title: "2. User Accounts & Responsibilities",
      content:
        "You are responsible for maintaining the confidentiality of your account credentials. You agree that any reviews, comments, and ratings you submit comply with community standards and do not contain offensive material.",
    },
    {
      icon: CreditCard,
      title: "3. Premium Subscriptions & Billing",
      content:
        "CineVerse offers a PRO subscription for $4.99/month, granting access to premium stats, ad removal, and unlimited AI searches. Billing is run recursively until cancelled. All simulation checkout activities are subject to mock processing.",
    },
    {
      icon: Sparkles,
      title: "4. Intellectual Property & API Use",
      content:
        "CineVerse code, design, and branding are the intellectual property of our company. Movie content, metadata, and images are retrieved via TMDB and are property of their respective creators. AI content generation is processed via Gemini Flash.",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-[#E50914]/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#E50914]/3 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-xs font-bold text-[#E50914]">
            <Scale className="w-3.5 h-3.5" />
            Legal Agreement
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Terms of <span className="text-[#E50914]">Service</span>
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
          By using CineVerse, you certify that you meet any local age requirements. Direct any inquiries to{" "}
          <span className="text-white font-medium">legal@cineverse.com</span>.
        </motion.div>
      </div>
    </div>
  );
}
