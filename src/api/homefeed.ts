import requests from "./requests.ts";
import { fetchHero, fetchList } from "./tmdb.ts";
import type { HomeFeed, HomeSection, MediaCard } from "../types/app";

function scoreForTop10(item: MediaCard): number {
  const popularity = item.popularity ?? 0;
  const vote = item.voteAverage ?? 0;
  return popularity * 0.7 + vote * 10 * 0.3;
}

function buildTop10(items: MediaCard[]): MediaCard[] {
  return [...items]
    .filter((x) => x.posterUrl || x.backdropUrl)
    .sort((a, b) => scoreForTop10(b) - scoreForTop10(a))
    .slice(0, 10)
    .map((x, idx) => ({ ...x, rank: idx + 1 }));
}

export async function buildHomeFeed(): Promise<HomeFeed> {
  const [hero, krSeries, usDrama, romance, trendingMovies] = await Promise.all([
    fetchHero(requests.fetchHero || requests.fetchTrending),
    fetchList(requests.fetchKrSeriesPopular),
    fetchList(requests.fetchUsDrama),
    fetchList(requests.fetchRomancePopular),
    fetchList(requests.fetchTrendingMovies),
  ]);

  const sections: HomeSection[] = [
    {
      key: "top10_kr_series",
      title: "오늘 대한민국의 TOP 10 시리즈",
      type: "top10",
      items: buildTop10(krSeries),
    },
    {
      key: "us_drama",
      title: "미국 드라마",
      type: "row",
      items: usDrama,
    },
    {
      key: "romance",
      title: "감정에 푹 빠지는 순간",
      type: "row",
      items: romance,
    },
    {
      key: "trending_movies",
      title: "NEW! 요즘 대세 콘텐츠",
      type: "row",
      items: trendingMovies,
    },
  ];

  return { hero, sections };
}
