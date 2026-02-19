// TMDB 응답 타입
export interface TMDBListResponse<T> {
  page?: number;
  results: T[];
  total_pages?: number;
  total_results?: number;
}

export type TMDBMediaType = "movie" | "tv" | "person";

export interface TMDBListItem {
  id: number;

  media_type?: TMDBMediaType;

  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;

  overview?: string;

  poster_path?: string | null;
  backdrop_path?: string | null;

  popularity?: number;
  vote_average?: number;
  vote_count?: number;

  release_date?: string;
  first_air_date?: string;

  adult?: boolean;

  [key: string]: unknown;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBVideoItem {
  id: string;
  key: string;
  name?: string;
  site?: string;
  type?: string;
  official?: boolean;
  published_at?: string;

  [key: string]: unknown;
}

export interface TMDBVideosResponse {
  id?: number;
  results: TMDBVideoItem[];
}

export interface TMDBCreditsCastItem {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;

  [key: string]: unknown;
}

export interface TMDBCreditsResponse {
  id?: number;
  cast?: TMDBCreditsCastItem[];
  crew?: unknown[];
  [key: string]: unknown;
}

export interface TMDBDetail {
  id: number;

  title?: string;
  name?: string;

  overview?: string;

  genres?: TMDBGenre[];

  release_date?: string;
  first_air_date?: string;

  runtime?: number | null;
  number_of_seasons?: number | null;

  poster_path?: string | null;
  backdrop_path?: string | null;

  popularity?: number;
  vote_average?: number;
  vote_count?: number;

  adult?: boolean;

  [key: string]: unknown;
}
