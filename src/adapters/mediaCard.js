const IMG_BASE = "https://image.tmdb.org/t/p";

export function toMediaCard(raw, contextMediaType) {
  const mediaType =
    raw?.media_type || contextMediaType || (raw?.title ? "movie" : "tv");

  const title = raw?.title ?? raw?.name ?? "제목 없음";

  const posterUrl = raw?.poster_path ? `${IMG_BASE}/w500${raw.poster_path}` : null;
  const backdropUrl = raw?.backdrop_path ? `${IMG_BASE}/original${raw.backdrop_path}` : null;

  return {
    id: raw.id,              
    title,
    mediaType,
    posterUrl,
    backdropUrl,
  };
}

export function toMediaCardList(results = [], contextMediaType) {
  return results.map((r) => toMediaCard(r, contextMediaType));
}