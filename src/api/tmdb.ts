// TMDB 호출 함수(단일 책임) + detail bundle
import axios from "./axios";
import { toMediaCard, toBannerItem, imgUrl } from "./mapper";
import type { MediaCard, DetailBundle, MediaType } from "../types/app";
import type {
  TMDBListItem,
  TMDBVideosResponse,
  TMDBCreditsResponse,
  TMDBDetail,
} from "../types/tmdb";

type Params = Record<string, string | number | boolean>;

function asTmdbItemArray(value: unknown): TMDBListItem[] {
  if (!Array.isArray(value)) return [];
  return value as TMDBListItem[];
}

function getResults(data: unknown): TMDBListItem[] {
  if (!data || typeof data !== "object") return [];
  const results = (data as { results?: unknown }).results;
  if (Array.isArray(results)) return asTmdbItemArray(results);
  return [];
}

// 리스트(섹션) 가져오기 
export async function fetchList(path: string, params: Params = {}): Promise<MediaCard[]> {
  const res = await axios.get(path, { params });
  return getResults(res.data).map(toMediaCard);
}

// 배너 1개 선정
export async function fetchHero(path: string): Promise<MediaCard | null> {
  const res = await axios.get(path);
  const items = getResults(res.data);
  if (!items.length) return null;

  const withBackdrop = items.filter((x) => x.backdrop_path);
  const pickFrom = withBackdrop.length ? withBackdrop : items;
  const picked = pickFrom[Math.floor(Math.random() * pickFrom.length)];

  return toBannerItem(picked);
}


// Detail Bundle + Cache
const detailCache = new Map<string, DetailBundle>(); // key: `${mediaType}:${id}`

type TmdbVideo = {
  site?: string;
  type?: string;
  official?: boolean;
  key?: string;
  name?: string;
};

function pickTrailerYoutubeKey(videos: TmdbVideo[] = []): string | null {
  const yt = videos.filter((v) => v.site === "YouTube");
  const best =
    yt.find((v) => v.type === "Trailer" && v.official) ||
    yt.find((v) => v.type === "Trailer") ||
    yt.find((v) => v.type === "Teaser") ||
    null;
  return best?.key ?? null;
}


/**
 * 상세 번들: detail + videos + recommendations + credits
 * trailerYoutubeKey가 없을 수 있음(null)
 * 캐싱 적용
 */
export async function fetchDetailBundle(mediaType: MediaType, id: number | string): Promise<DetailBundle> {
  const key = `${mediaType}:${id}`;
  const cached = detailCache.get(key);
  if (cached) return cached;

  const base = mediaType === "tv" ? "/tv" : "/movie";

  const [detailRes, videosRes, recRes, creditsRes] = await Promise.all([
    axios.get(`${base}/${id}`),
    axios.get(`${base}/${id}/videos`),
    axios.get(`${base}/${id}/recommendations`),
    axios.get(`${base}/${id}/credits`),
  ]);

  const detail: TMDBDetail = (detailRes.data ?? {}) as TMDBDetail;
  const videosResponse: TMDBVideosResponse = (videosRes.data ?? { results: [] }) as TMDBVideosResponse;
  const credits: TMDBCreditsResponse = (creditsRes.data ?? {}) as TMDBCreditsResponse;
  const videos: TmdbVideo[] = videosResponse.results ?? [];
  const trailerYoutubeKey = pickTrailerYoutubeKey(videos);

  const recommendations: MediaCard[] = (recRes.data?.results ?? []).map(toMediaCard);
  const cast = (credits.cast ?? []).slice(0, 10).map((c) => ({
    id: Number(c?.id ?? 0),
    name: String(c?.name ?? ""),
    character: String(c?.character ?? ""),
    profileUrl: imgUrl(c?.profile_path, "w185"),
  }));

  // detail도 MediaCard로 정규화(기존 item과 구조 통일)
  const item: MediaCard = {
    id: Number(detail?.id ?? id),
    mediaType: mediaType === "tv" ? "tv" : "movie",
    title: detail?.title ?? detail?.name ?? "제목 없음",
    originalTitle: detail?.original_title ?? detail?.original_name,
    overview: detail?.overview ?? "",
    releaseDate: detail?.release_date ?? detail?.first_air_date ?? undefined,
    posterUrl: imgUrl(detail?.poster_path, "w500"),
    backdropUrl: imgUrl(detail?.backdrop_path, "original"),
    popularity: detail?.popularity ?? undefined,
    voteAverage: detail?.vote_average ?? undefined,
    voteCount: detail?.vote_count ?? undefined,
    adult: detail?.adult ?? undefined,
    raw: detail,
  };

  const bundle: DetailBundle = {
    item,
    videos: videos
      .filter((v) => v?.site && v?.key)
      .map((v) => ({
        id: `${v.site}:${v.key}`,
        key: v.key as string,
        name: v.name,
        site: v.site,
        type: v.type,
      })),
  
    recommendations,
    cast,
    trailerYoutubeKey,
    genres: (detail?.genres ?? []).map((g) => String(g?.name ?? "")).filter(Boolean),
    runtime: detail?.runtime ?? undefined,
    numberOfSeasons: detail?.number_of_seasons ?? undefined,
  };

  detailCache.set(key, bundle);
  return bundle;
}

