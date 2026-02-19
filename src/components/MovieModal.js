"use client";

import { useEffect, useState } from "react";
import "./MovieModal.css";
import axios from "@/api/axios";
import requests from "@/api/requests";

export default function MovieModal({ open, item, onClose }) {
  const [detail, setDetail] = useState(null);
  const [detailStatus, setDetailStatus] = useState("idle"); 

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

  // ✅ open + item 바뀔 때 TMDB detail 가져오기
  useEffect(() => {
    if (!open || !item) return;

    let canceled = false;

    async function fetchDetail() {
      try {
        setDetailStatus("loading");
        setDetail(null);

        const mediaType = item.mediaType === "tv" ? "tv" : "movie";
        const res = await axios.get(
          requests.fetchDetail(mediaType, item.id)
        );

        if (canceled) return;
        setDetail(res.data);
        setDetailStatus("ready");
      } catch (e) {
        console.error(e);
        if (canceled) return;
        setDetail(null);
        setDetailStatus("error");
      }
    }

    fetchDetail();

    return () => {
      canceled = true;
    };
  }, [open, item]);

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
            <span className="pill">{item.mediaType?.toUpperCase()}</span>
            <span className="pill">HD</span>
            <span className="pill">15</span>
          </div>

          <p className="modalDesc">
            {detailStatus === "loading" && "줄거리 불러오는 중..."}
            {detailStatus === "error" && "줄거리 정보를 불러오지 못했어. (콘솔 확인)"}
            {detailStatus === "ready" &&
              (detail?.overview ? detail.overview : "줄거리 정보가 없어요.")}
            {detailStatus === "idle" && ""}
          </p>
        </div>
      </div>
    </div>
  );
}
