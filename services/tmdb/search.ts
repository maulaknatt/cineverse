import { fetchTMDB } from "./client";
import type { TMDBResponse, TMDBSearchMulti, TMDBMovie } from "@/types/tmdb";

export async function searchMulti(query: string, page: number = 1) {
  return fetchTMDB<TMDBResponse<TMDBSearchMulti>>("/search/multi", {
    query,
    page,
    language: "en-US",
    include_adult: false,
  });
}

export async function searchMoviesOnly(query: string, page: number = 1) {
  return fetchTMDB<TMDBResponse<TMDBMovie>>("/search/movie", {
    query,
    page,
    language: "en-US",
    include_adult: false,
  });
}

export async function searchTVOnly(query: string, page: number = 1) {
  return fetchTMDB<TMDBResponse<any>>("/search/tv", {
    query,
    page,
    language: "en-US",
    include_adult: false,
  });
}
