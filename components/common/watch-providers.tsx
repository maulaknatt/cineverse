"use client";

import Image from "next/image";
import { getLogoURL } from "@/utils/tmdb-image";
import type { TMDBWatchProvidersResponse } from "@/types/tmdb";
import { Play } from "lucide-react";

interface WatchProvidersProps {
  providers?: TMDBWatchProvidersResponse;
}

export function WatchProviders({ providers }: WatchProvidersProps) {
  if (!providers || !providers.results) return null;

  // Prioritize Indonesia (ID), then fallback to US (US) or others
  const results = providers.results;
  const targetData = results["ID"] || results["US"] || Object.values(results)[0];

  if (!targetData) return null;

  const isIndonesia = !!results["ID"];
  const flatrate = targetData.flatrate || [];
  const rent = targetData.rent || [];
  const buy = targetData.buy || [];
  const free = targetData.free || [];

  // Group active providers
  const hasProviders = flatrate.length > 0 || free.length > 0 || rent.length > 0 || buy.length > 0;

  if (!hasProviders) {
    return (
      <div className="mt-6 glass border-white/5 rounded-2xl p-4 bg-zinc-900/10">
        <p className="text-zinc-500 text-xs text-center font-medium">
          Not available for online streaming.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 glass border-white/5 rounded-2xl p-4 space-y-4 bg-zinc-900/20">
      <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
        <Play className="w-3.5 h-3.5 text-[#E50914] fill-current" />
        <span>Where to Watch {isIndonesia ? "(Indonesia)" : "(US)"}</span>
      </div>

      {/* Subscription/Stream List */}
      {flatrate.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-black tracking-widest text-[#E50914]">Stream</span>
          <div className="flex flex-wrap gap-2">
            {flatrate.map((provider) => (
              <div
                key={provider.provider_id}
                className="group relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 hover:border-[#E50914]/40 hover:scale-105 transition-all shadow-md bg-zinc-950 cursor-pointer"
                title={provider.provider_name}
              >
                <Image
                  src={getLogoURL(provider.logo_path, "w92")}
                  alt={provider.provider_name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Free stream list */}
      {free.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-black tracking-widest text-green-500">Free</span>
          <div className="flex flex-wrap gap-2">
            {free.map((provider) => (
              <div
                key={provider.provider_id}
                className="group relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 hover:border-green-500/40 hover:scale-105 transition-all shadow-md bg-zinc-950 cursor-pointer"
                title={provider.provider_name}
              >
                <Image
                  src={getLogoURL(provider.logo_path, "w92")}
                  alt={provider.provider_name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rent or Buy list */}
      {(rent.length > 0 || buy.length > 0) && (
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-black tracking-widest text-amber-500">Rent / Buy</span>
          <div className="flex flex-wrap gap-2">
            {/* Merge and filter unique providers for Rent & Buy */}
            {Array.from(
              new Map([...rent, ...buy].map((item) => [item.provider_id, item])).values()
            ).slice(0, 6).map((provider) => (
              <div
                key={provider.provider_id}
                className="group relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 hover:border-amber-500/40 hover:scale-105 transition-all shadow-md bg-zinc-950 cursor-pointer"
                title={provider.provider_name}
              >
                <Image
                  src={getLogoURL(provider.logo_path, "w92")}
                  alt={provider.provider_name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provider attribution */}
      <div className="text-[9px] text-zinc-600 text-center font-medium pt-1 border-t border-white/5">
        Data provided by JustWatch.
      </div>
    </div>
  );
}
