import { useEffect, useState } from "react";
import { buildHomeFeed } from "../api/homefeed";
import type { HomeFeed, HomeSection, MediaCard } from "../types/app";

type UseHomeFeedResult = {
  hero: MediaCard | null;
  sections: HomeSection[];
  loading: boolean;
  error: string;
};

export default function useHomeFeed(): UseHomeFeedResult {
  const [hero, setHero] = useState<MediaCard | null>(null);
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const data: HomeFeed = await buildHomeFeed();

        if (!alive) return;
        setHero(data.hero);
        setSections(data.sections);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "홈 데이터를 불러오지 못했습니다.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { hero, sections, loading, error };
}
