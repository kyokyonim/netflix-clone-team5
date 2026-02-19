"use client";

import { useEffect } from "react";
import "./MovieModal.css";
import useDetailBundle from "@/hooks/useDetailBundle";

function getPlayableMediaType(item) {
  if (!item) return undefined;
  if (item.mediaType === "movie" || item.mediaType === "tv") return item.mediaType;
  return undefined;
}

export default function MovieModal({ open, item, onClose }) {
  const mediaType = getPlayableMediaType(item);
  const { data, loading, error } = useDetailBundle(
    mediaType,
    item?.id,
    open && !!item && !!mediaType
  );

  // ESC 닫기 + 스크롤 잠금
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !item) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalSheet" onClick={(e) => e.stopPropagation()}>
        <button className="modalClose" onClick={onClose} aria-label="close">
          ✕
        </button>

        <div className="modalHero">
          {item.backdropUrl ? (
            <img className="modalHeroImg" src={item.backdropUrl} alt={item.title} />
          ) : (
            <div className="modalHeroFallback" />
          )}

          <div className="modalHeroShade" />

          <div className="modalHeroContent">
            <h2 className="modalTitle">{item.title}</h2>

            <div className="modalActions">
              <button className="modalPlayBtn">▶ 재생</button>
              <button className="modalInfoBtn">＋ 내가 찜한 콘텐츠</button>
            </div>
          </div>
        </div>

        <div className="modalBody">
          <div className="modalMeta">
            <span className="pill">{(item.mediaType || "unknown").toUpperCase()}</span>
            <span className="pill">HD</span>
            <span className="pill">15</span>
          </div>

          <p className="modalDesc">
            {loading && "줄거리 불러오는 중..."}
            {!loading && error && "줄거리 정보를 불러오지 못했어. (콘솔 확인)"}
            {!loading &&
              !error &&
              (data?.item?.overview ? data.item.overview : "줄거리 정보가 없어요.")}
          </p>
        </div>
      </div>
    </div>
  );
}
