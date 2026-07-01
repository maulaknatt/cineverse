"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Search, Sparkles, Menu, X } from "lucide-react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { useTranslation } from "@/hooks/use-translation";



export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, lang, toggleLanguage } = useTranslation();

  const links = [
    { href: "/movies", label: t.movies },
    { href: "/tv", label: t.series },
    { href: "/trending", label: t.trending },
    { href: "/community", label: t.community },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#E50914] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
                Cine<span className="text-[#E50914]">Verse</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "text-white bg-white/10"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <SignedIn>
                <Link
                  href="/dashboard"
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    pathname.startsWith("/dashboard")
                      ? "text-white bg-white/10"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {t.dashboard}
                </Link>
              </SignedIn>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/search"
              className="p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label={t.search}
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              href="/ai"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition-colors border border-indigo-500/20"
            >
              <Sparkles className="w-4 h-4" />
              {t.aiPicks}
            </Link>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center h-8 min-w-[36px]"
              title={lang === "en" ? "Ubah ke Bahasa Indonesia" : "Switch to English"}
            >
              <span className="uppercase text-[10px] tracking-wider font-extrabold">{lang === "en" ? "EN" : "ID"}</span>
            </button>

            <div className="h-6 w-px bg-white/10 hidden sm:block mx-1" />

            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 border border-white/20",
                  },
                }}
              />
            </SignedIn>
            
            <SignedOut>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-white bg-[#E50914] rounded-lg hover:bg-[#b20710] transition-colors"
              >
                Sign In
              </Link>
            </SignedOut>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 md:hidden transition-all"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-white/5 bg-black/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {links.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-2.5 rounded-xl text-base font-medium transition-all",
                      isActive
                        ? "text-white bg-white/10"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <SignedIn>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 rounded-xl text-base font-medium transition-all",
                    pathname.startsWith("/dashboard")
                      ? "text-white bg-white/10"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {t.dashboard}
                </Link>
              </SignedIn>

              {/* Mobile AI Picks */}
              <Link
                href="/ai"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium transition-all",
                  pathname.startsWith("/ai")
                    ? "text-indigo-400 bg-indigo-500/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Sparkles className="w-5 h-5 text-indigo-400" />
                {t.aiPicks}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
