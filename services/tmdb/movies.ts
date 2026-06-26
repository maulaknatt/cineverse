import { fetchTMDB } from "./client";
import type { TMDBResponse, TMDBMovie, TMDBMovieDetail } from "@/types/tmdb";

export async function getTrendingMovies(timeWindow: "day" | "week" = "day") {
  return fetchTMDB<TMDBResponse<TMDBMovie>>(`/trending/movie/${timeWindow}`, {
    language: "en-US",
  });
}

export async function getPopularMovies(page: number = 1) {
  return fetchTMDB<TMDBResponse<TMDBMovie>>("/movie/popular", {
    language: "en-US",
    page,
  });
}

export async function getTopRatedMovies(page: number = 1) {
  return fetchTMDB<TMDBResponse<TMDBMovie>>("/movie/top_rated", {
    language: "en-US",
    page,
  });
}

export async function getNowPlayingMovies(page: number = 1) {
  return fetchTMDB<TMDBResponse<TMDBMovie>>("/movie/now_playing", {
    language: "en-US",
    page,
  });
}

export async function getUpcomingMovies(page: number = 1) {
  return fetchTMDB<TMDBResponse<TMDBMovie>>("/movie/upcoming", {
    language: "en-US",
    page,
  });
}

export async function getMovieDetail(id: string | number) {
  return fetchTMDB<TMDBMovieDetail>(`/movie/${id}`, {
    language: "en-US",
    append_to_response: "credits,videos,recommendations",
  });
}

export async function discoverMovies(params: Record<string, string | number> = {}) {
  return fetchTMDB<TMDBResponse<TMDBMovie>>("/discover/movie", {
    language: "en-US",
    include_adult: false,
    include_video: false,
    ...params,
  });
}
