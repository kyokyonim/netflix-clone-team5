import React from "react";
import { useParams } from "react-router-dom";
import useDetailBundle from "../../hooks/useDetailBundle.ts";
import type { MediaType } from "../../types/app";

export default function DetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const mediaType: MediaType = "movie";

  const { data, loading, error } = useDetailBundle(
    mediaType,
    movieId,
    Boolean(movieId)
  );

  if (loading) return <div style={{ color: "#fff" }}>로딩중...</div>;
  if (error) return <div style={{ color: "#fff" }}>{error}</div>;
  if (!data) return null;

  return (
    <section>
      <img
        className="modal__poster-img"
        src={data.item.backdropUrl || data.item.posterUrl}
        alt={data.item.title}
      />
    </section>
  );
}

