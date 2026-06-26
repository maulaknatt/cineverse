export interface APIResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedAPIResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
}

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface SearchFilters {
  genre?: number;
  year?: number;
  minRating?: number;
  language?: string;
  minRuntime?: number;
  maxRuntime?: number;
  sortBy?: SortOption;
}

export type SortOption =
  | "popularity.desc"
  | "popularity.asc"
  | "vote_average.desc"
  | "vote_average.asc"
  | "release_date.desc"
  | "release_date.asc"
  | "revenue.desc"
  | "title.asc";
