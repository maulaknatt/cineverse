import Link from "next/link";
import { Film, Github, Twitter, Instagram, Heart } from "lucide-react";

const FOOTER_LINKS = {
  Discover: [
    { label: "Trending", href: "/trending" },
    { label: "Popular Movies", href: "/popular" },
    { label: "Top Rated", href: "/top-rated" },
    { label: "Series", href: "/tv" },
    { label: "Genres", href: "/genres" },
  ],
  Features: [
    { label: "AI Recommendation", href: "/ai" },
    { label: "Community", href: "/community" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ],
};

const SOCIAL_LINKS = [
  { icon: Twitter, href: "https://twitter.com/cineverse", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/cineverse", label: "Instagram" },
  { icon: Github, href: "https://github.com/cineverse", label: "GitHub" },
];

export function Footer() {
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
              Discover Movies Smarter. AI-powered movie discovery platform
              helping you find your next favorite film through mood, genre, and
              intelligent recommendations.
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
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
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
            © 2025 CineVerse. All rights reserved.
          </p>
          <p className="text-xs text-zinc-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-[#E50914] fill-current" /> for movie lovers
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
