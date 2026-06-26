const TMDB_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

export type PosterSize = "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";
export type BackdropSize = "w300" | "w780" | "w1280" | "original";
export type ProfileSize = "w45" | "w185" | "h632" | "original";
export type LogoSize = "w45" | "w92" | "w154" | "w185" | "w300" | "w500" | "original";

export function getPosterURL(path: string | null | undefined, size: PosterSize = "w500"): string {
  if (!path) return "/placeholder-poster.jpg";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropURL(path: string | null | undefined, size: BackdropSize = "w1280"): string {
  if (!path) return "/placeholder-backdrop.jpg";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getProfileURL(path: string | null | undefined, size: ProfileSize = "w185"): string {
  if (!path) return "/placeholder-avatar.jpg";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getLogoURL(path: string | null | undefined, size: LogoSize = "w300"): string {
  if (!path) return "";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
