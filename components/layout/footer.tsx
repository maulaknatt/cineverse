"use client";

import Link from "next/link";
import { Film, Github, Twitter, Instagram, Heart } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const SOCIAL_LINKS = [
  { icon: Twitter, href: "https://twitter.com/cineverse", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/cineverse", label: "Instagram" },
  { icon: Github, href: "https://github.com/cineverse", label: "GitHub" },
];

export function Footer() {
  const { t, lang } = useTranslation();

  const footerLinks = {
    [t.discover]: [
      { label: t.trending, href: "/trending" },
      { label: t.popularMovies, href: "/movies?sort=popularity.desc" },
      { label: t.topRated, href: "/movies?sort=vote_average.desc" },
      { label: t.series, href: "/tv" },
      { label: t.genres, href: "/genres" },
    ],
    [t.features]: [
      { label: t.aiRecommendation, href: "/ai" },
      { label: t.community, href: "/community" },
      { label: t.dashboard, href: "/dashboard" },
    ],
    [t.company]: [
      { label: t.about, href: "/about" },
      { label: t.blog, href: "/blog" },
      { label: t.privacyPolicy, href: "/privacy" },
      { label: t.termsOfService, href: "/terms" },
      { label: t.contact, href: "/contact" },
    ],
  };

  const appDescription =
    lang === "en"
      ? "Discover Movies Smarter. AI-powered movie discovery platform helping you find your next favorite film through mood, genre, and intelligent recommendations."
      : "Temukan film dengan cara yang lebih cerdas. Platform penemuan film berbasis AI untuk membantu Anda menemukan film favorit berikutnya melalui suasana hati, genre, dan rekomendasi pintar.";

  const copyrightText =
    lang === "en"
      ? `© ${new Date().getFullYear()} CineVerse. All rights reserved.`
      : `© ${new Date().getFullYear()} CineVerse. Hak cipta dilindungi undang-undang.`;

  const footerLoveText = lang === "en" ? "Made with" : "Dibuat dengan";
  const footerForLovers = lang === "en" ? "for movie lovers" : "untuk pecinta film";

  return (
    <footer className="border-t border-white/5 bg-[#09090B]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E50914] flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Cine<span className="text-[#E50914]">Verse</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mb-6">
              {appDescription}
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all border border-white/5"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            {copyrightText}
          </p>
          <p className="text-xs text-zinc-500 flex items-center gap-1">
            {footerLoveText} <Heart className="w-3 h-3 text-[#E50914] fill-current" /> {footerForLovers}
          </p>
          <p className="text-xs text-zinc-600">
            Powered by{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-400 transition-colors"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
