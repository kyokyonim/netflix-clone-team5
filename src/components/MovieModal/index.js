import React, { useRef } from "react";
import "./MovieModal.css";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import useDetailBundle from "../../hooks/useDetailBundle.ts";

function inferMediaTypeFromProps(props) {
  if (props.mediaType === "movie" || props.mediaType === "tv") return props.mediaType;
  if (props.first_air_date || props.name) return "tv";
  return "movie";
}

function MovieModal(props) {
  const {
    id,
    mediaType,
    backdrop_path,
    title,
    overview,
    name,
    release_date,
    first_air_date,
    vote_average,
    setModalOpen,
  } = props;

  const ref = useRef();

  useOnClickOutside(ref, () => {
    setModalOpen(false);
  });

  const mt = inferMediaTypeFromProps(props);
  const enabled = Boolean(id);

  const { data, loading, error } = useDetailBundle(mt, id, enabled);

  const displayTitle = title || name || data?.item?.title || "제목 없음";
  const displayDate = release_date || first_air_date || data?.item?.releaseDate || "";
  const displayOverview = overview || data?.item?.overview || "";
  const displayVote = vote_average ?? data?.item?.voteAverage ?? "";

  const backdropUrl =
    data?.item?.backdropUrl ||
    (backdrop_path ? `https://image.tmdb.org/t/p/original/${backdrop_path}` : "");

  const trailerKey = data?.trailerYoutubeKey || null;

  return (
    <div className="presentation">
      <div className="wrapper-modal">
        <div className="modal" ref={ref}>
          <span onClick={() => setModalOpen(false)} className="modal-close">
            X
          </span>

          {backdropUrl ? (
            <img className="modal__poster-img" src={backdropUrl} alt="modal__poster-img" />
          ) : null}

          <div className="modal__content">
            <p className="modal__details">
              <span className="modal__user_perc">100% for you</span> {displayDate}
            </p>

            <h2 className="modal__title">{displayTitle}</h2>
            <p className="modal__overview">평점: {displayVote}</p>
            <p className="modal__overview">{displayOverview}</p>

            {loading && <p className="modal__overview">상세 정보 불러오는 중...</p>}
            {error && <p className="modal__overview">{error}</p>}

            {trailerKey && (
              <div style={{ marginTop: 16 }}>
                <iframe
                  width="100%"
                  height="360"
                  src={`https://www.youtube.com/embed/${trailerKey}?controls=1`}
                  title="trailer"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            )}

            {data?.cast?.length ? (
              <div style={{ marginTop: 16 }}>
                <h3 style={{ marginBottom: 8 }}>주요 출연진</h3>
                <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
                  {data.cast.map((c) => (
                    <div key={c.id} style={{ minWidth: 120 }}>
                      {c.profileUrl ? (
                        <img
                          src={c.profileUrl}
                          alt={c.name}
                          style={{ width: 120, borderRadius: 8 }}
                        />
                      ) : null}
                      <div style={{ fontSize: 14, marginTop: 6 }}>{c.name}</div>
                      <div style={{ fontSize: 12, opacity: 0.8 }}>{c.character}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {data?.recommendations?.length ? (
              <div style={{ marginTop: 16 }}>
                <h3 style={{ marginBottom: 8 }}>추천 콘텐츠</h3>
                <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
                  {data.recommendations.slice(0, 12).map((r) => (
                    <div key={r.id} style={{ minWidth: 140 }}>
                      {r.posterUrl ? (
                        <img
                          src={r.posterUrl}
                          alt={r.title}
                          style={{ width: 140, borderRadius: 8 }}
                        />
                      ) : null}
                      <div style={{ fontSize: 13, marginTop: 6 }}>{r.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
