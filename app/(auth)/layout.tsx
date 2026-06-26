import Link from "next/link";
import { Film } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center relative px-4 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E50914]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 z-10">
        <Link href="/" className="flex items-center gap-2 group.">
          <div className="w-10 h-10 rounded-xl bg-[#E50914] flex items-center justify-center shadow-lg shadow-[#E50914]/20 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Cine<span className="text-[#E50914]">Verse</span>
          </span>
        </Link>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md z-10 flex justify-center">
        {children}
      </div>
    </div>
  );
}
