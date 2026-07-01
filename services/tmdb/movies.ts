import { fetchTMDB } from "./client";
import type { TMDBResponse, TMDBMovie, TMDBMovieDetail } from "@/types/tmdb";

export async function getTrendingMovies(timeWindow: "day" | "week" = "day", language = "en-US") {
  return fetchTMDB<TMDBResponse<TMDBMovie>>(`/trending/movie/${timeWindow}`, {
    language,
  });
}

export async function getPopularMovies(page: number = 1, language = "en-US") {
  return fetchTMDB<TMDBResponse<TMDBMovie>>("/movie/popular", {
    language,
    page,
  });
}

export async function getTopRatedMovies(page: number = 1, language = "en-US") {
  return fetchTMDB<TMDBResponse<TMDBMovie>>("/movie/top_rated", {
    language,
    page,
  });
}

export async function getNowPlayingMovies(page: number = 1, language = "en-US") {
  return fetchTMDB<TMDBResponse<TMDBMovie>>("/movie/now_playing", {
    language,
    page,
  });
}

export async function getUpcomingMovies(page: number = 1, language = "en-US") {
  return fetchTMDB<TMDBResponse<TMDBMovie>>("/movie/upcoming", {
    language,
    page,
  });
}

export async function getMovieDetail(id: string | number, language = "en-US") {
  return fetchTMDB<TMDBMovieDetail>(`/movie/${id}`, {
    language,
    append_to_response: "credits,videos,recommendations,watch/providers",
  });
}

export async function discoverMovies(params: Record<string, string | number> = {}, language = "en-US") {
  return fetchTMDB<TMDBResponse<TMDBMovie>>("/discover/movie", {
    language,
    include_adult: false,
    include_video: false,
    ...params,
  });
}
