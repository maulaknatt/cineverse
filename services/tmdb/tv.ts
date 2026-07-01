import { fetchTMDB } from "./client";
import type { TMDBResponse, TMDBTVShow, TMDBTVDetail } from "@/types/tmdb";

export async function getTrendingTV(timeWindow: "day" | "week" = "day", language = "en-US") {
  return fetchTMDB<TMDBResponse<TMDBTVShow>>(`/trending/tv/${timeWindow}`, {
    language,
  });
}

export async function getPopularTV(page: number = 1, language = "en-US") {
  return fetchTMDB<TMDBResponse<TMDBTVShow>>("/tv/popular", {
    language,
    page,
  });
}

export async function getTopRatedTV(page: number = 1, language = "en-US") {
  return fetchTMDB<TMDBResponse<TMDBTVShow>>("/tv/top_rated", {
    language,
    page,
  });
}

export async function getTVDetail(id: string | number, language = "en-US") {
  return fetchTMDB<TMDBTVDetail>(`/tv/${id}`, {
    language,
    append_to_response: "credits,videos,recommendations,watch/providers",
  });
}

export async function discoverTV(params: Record<string, string | number> = {}, language = "en-US") {
  return fetchTMDB<TMDBResponse<TMDBTVShow>>("/discover/tv", {
    language,
    include_adult: false,
    ...params,
  });
}
