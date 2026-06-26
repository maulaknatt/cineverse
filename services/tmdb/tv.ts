import { fetchTMDB } from "./client";
import type { TMDBResponse, TMDBTVShow, TMDBTVDetail } from "@/types/tmdb";

export async function getTrendingTV(timeWindow: "day" | "week" = "day") {
  return fetchTMDB<TMDBResponse<TMDBTVShow>>(`/trending/tv/${timeWindow}`, {
    language: "en-US",
  });
}

export async function getPopularTV(page: number = 1) {
  return fetchTMDB<TMDBResponse<TMDBTVShow>>("/tv/popular", {
    language: "en-US",
    page,
  });
}

export async function getTopRatedTV(page: number = 1) {
  return fetchTMDB<TMDBResponse<TMDBTVShow>>("/tv/top_rated", {
    language: "en-US",
    page,
  });
}

export async function getTVDetail(id: string | number) {
  return fetchTMDB<TMDBTVDetail>(`/tv/${id}`, {
    language: "en-US",
    append_to_response: "credits,videos,recommendations",
  });
}

export async function discoverTV(params: Record<string, string | number> = {}) {
  return fetchTMDB<TMDBResponse<TMDBTVShow>>("/discover/tv", {
    language: "en-US",
    include_adult: false,
    ...params,
  });
}
