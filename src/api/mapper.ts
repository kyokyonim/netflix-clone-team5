// TMDB 이미지/데이터 정규화 mapper
import type { MediaCard, MediaType } from "../types/app";
import type { TMDBListItem } from "../types/tmdb";

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";

// TMDB 이미지 URL 생성 (없으면 undefined)
export function imgUrl(path?: string | null, size: string = "w500"): string | undefined {
  if (!path) return undefined;
  return `${TMDB_IMAGE_BASE}${size}${path}`;
}

// TMDB item에서 media type 추론 (반드시 MediaType만 반환)
export function inferMediaType(item: TMDBListItem): MediaType {
  const mt = item?.media_type;
  if (mt === "movie" || mt === "tv" || mt === "person") return mt;
  if (item?.first_air_date || item?.name || item?.original_name) return "tv";
  if (item?.release_date || item?.title || item?.original_title) return "movie";

  return "unknown";
}

export function toMediaCard(item: TMDBListItem): MediaCard {
  const mediaType = inferMediaType(item);

  const title: string =
    item?.title ||
    item?.name ||
    item?.original_title ||
    item?.original_name ||
    "제목 없음";

  return {
    id: Number(item?.id ?? 0),
    mediaType,
    title,
    originalTitle: item?.original_title || item?.original_name,
    overview: item?.overview ?? "",
    posterUrl: imgUrl(item?.poster_path, "w500"),
    backdropUrl: imgUrl(item?.backdrop_path, "original"),
    voteAverage: item?.vote_average ?? undefined,
    popularity: item?.popularity ?? undefined,
    voteCount: item?.vote_count ?? undefined,
    releaseDate: item?.release_date || item?.first_air_date || undefined,
    adult: item?.adult ?? undefined,
    raw: item,
  };
}

// 배너용(가로 이미지 우선)
export function toBannerItem(item: TMDBListItem): MediaCard {
  const card = toMediaCard(item);
  return {
    ...card,
    backdropUrl: card.backdropUrl || card.posterUrl,
  };
}
