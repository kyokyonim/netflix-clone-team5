import { useEffect, useState } from "react";
import { fetchDetailBundle } from "../api/tmdb";
import type { DetailBundle, MediaType } from "../types/app";

type UseDetailBundleResult = {
  data: DetailBundle | null;
  loading: boolean;
  error: string;
};

export default function useDetailBundle(
  mediaType: MediaType | undefined,
  id: number | string | undefined,
  enabled: boolean = true
): UseDetailBundleResult {
  const [data, setData] = useState<DetailBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled || !mediaType || id === undefined || id === null) return;

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetchDetailBundle(mediaType, id);
        if (!alive) return;
        setData(res);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "상세 정보를 불러오지 못했습니다.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [mediaType, id, enabled]);

  return { data, loading, error };
}
