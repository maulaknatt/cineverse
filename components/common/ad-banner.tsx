"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, X, Megaphone, ArrowRight } from "lucide-react";
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
    <div className="w-full relative my-8 overflow-hidden rounded-2xl glass border-[#E50914]/20 bg-gradient-to-r from-[#E50914]/5 via-white/[0.01] to-[#E50914]/5 shadow-xl transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />
      
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Ad message */}
        <div className="flex items-center gap-3.5 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-10 h-10 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center text-[#E50914] shrink-0">
            <Megaphone className="w-4.5 h-4.5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <span className="text-[9px] uppercase tracking-widest bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-white/5 font-extrabold font-mono">
                Sponsored
              </span>
              <h4 className="font-bold text-white text-xs">Unlock CineVerse PRO today!</h4>
            </div>
            <p className="text-zinc-400 text-[10px] leading-relaxed max-w-xl">
              Get unlimited AI recommendations, advanced watch habits analytics, private collections, and remove all sponsor ads for only $4.99/mo.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
          <Link
            href="/upgrade"
            className="flex items-center gap-1.5 bg-[#E50914] hover:bg-[#b8070f] text-white px-4 py-2 rounded-xl font-bold text-[10px] shadow-lg shadow-[#E50914]/15 transition-all shrink-0 cursor-pointer"
          >
            <span>Upgrade to PRO</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
