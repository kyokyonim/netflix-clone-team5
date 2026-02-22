"use client";

import { useState, useCallback } from "react";
import { fetchDetailBundle } from "@/api/tmdb";

function getPlayableMediaType(item) {
  if (!item) return null;
  return item.mediaType === "movie" || item.mediaType === "tv" ? item.mediaType : null;
}

export default function useHeroTrailer(hero) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  const play = useCallback(async () => {
    try {
      const mediaType = getPlayableMediaType(hero);
      if (!mediaType) return setTrailerKey(null);

      const detail = await fetchDetailBundle(mediaType, hero.id);
      setTrailerKey(detail.trailerYoutubeKey ?? null);
    } catch (e) {
      console.error(e);
      setTrailerKey(null);
    }
  }, [hero]);

  const close = useCallback(() => setTrailerKey(null), []);

  return { trailerKey, isMuted, setIsMuted, play, close };
}
