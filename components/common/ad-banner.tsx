"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Megaphone, ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function AdBanner() {
  const { user, isLoaded } = useUser();
  const [isPro, setIsPro] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    async function checkProStatus() {
      if (user) {
        try {
          const res = await fetch("/api/users/me/pro-status");
          if (res.ok) {
            const data = await res.json();
            setIsPro(data.isPro);
          }
        } catch (err) {
          console.error("Failed to fetch Pro status for AdBanner:", err);
        }
      }
    }

    if (isLoaded) {
      checkProStatus();
    }
  }, [user, isLoaded]);

  // Hide ads completely for PRO members, or if closed by user
  if (!isVisible || (isLoaded && isPro)) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto w-full relative my-6 overflow-hidden rounded-3xl glass border border-white/5 hover:border-[#E50914]/20 bg-gradient-to-r from-[#E50914]/5 via-zinc-950/20 to-[#E50914]/5 shadow-xl transition-all duration-300">
      {/* Top subtle highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/25 to-transparent" />
      
      {/* Close button in top right */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer p-1.5 rounded-full hover:bg-white/5 z-10"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="pt-10 pb-6 px-6 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 md:pr-12">
        {/* Ad message */}
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="w-12 h-12 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center text-[#E50914] shrink-0 shadow-md shadow-[#E50914]/5">
            <Megaphone className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <span className="text-[9px] uppercase tracking-widest bg-white/5 text-[#E50914] px-2 py-0.5 rounded border border-[#E50914]/20 font-black">
                Sponsored
              </span>
              <h4 className="font-extrabold text-white text-sm tracking-tight">Unlock CineVerse PRO today!</h4>
            </div>
            <p className="text-zinc-300 text-xs leading-relaxed max-w-2xl font-medium">
              Get unlimited AI recommendations, advanced watch habits analytics, private collections, and remove all sponsor ads for only <span className="text-amber-500 font-bold">$4.99/mo</span>.
            </p>
          </div>
        </div>

        {/* Action button */}
        <Link
          href="/upgrade"
          className="flex items-center gap-1.5 bg-[#E50914] hover:bg-[#b8070f] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-[#E50914]/15 hover:shadow-[#E50914]/30 hover:scale-102 transition-all shrink-0 cursor-pointer w-full md:w-auto justify-center"
        >
          <span>Upgrade to PRO</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
