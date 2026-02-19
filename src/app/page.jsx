"use client";

import { useEffect, useState } from "react";
import axios from "@/api/axios";
import requests from "@/api/requests";
import { toMediaCardList } from "@/adapters/mediaCard";
import Row from "@/components/Row";
import MovieModal from "@/components/MovieModal";

export default function Page() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading"); 

  // Trailer
  const [trailerKey, setTrailerKey] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  // Modal
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function fetchHome() {
      try {
        setStatus("loading");

        const [trendingRes, originalsRes, topRatedRes] = await Promise.all([
          axios.get(requests.fetchTrending),
          axios.get(requests.fetchNetflixOriginals),
          axios.get(requests.fetchTopRated),
        ]);

        const makeRow = (title, res, contextType) => ({
          title,
          items: toMediaCardList(res.data?.results ?? [], contextType),
        });

        setRows([
          makeRow("오늘 대한민국 TOP 10 시리즈", trendingRes, undefined),
          makeRow("Netflix Originals", originalsRes, "tv"),
          makeRow("Top Rated", topRatedRes, "movie"),
        ]);

        setStatus("ready");
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    }

    fetchHome();
  }, []);

  if (status === "loading") {
    return (
      <main style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
        <div style={{ padding: 60, fontSize: 24 }}>Loading...</div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
        <div style={{ padding: 60, fontSize: 24 }}>Error</div>
      </main>
    );
  }

  if (!rows.length || !rows[0]?.items?.length) {
    return (
      <main style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
        <div style={{ padding: 60, fontSize: 24 }}>Empty</div>
      </main>
    );
  }

  const hero = rows[0].items[0];

  const handlePlay = async () => {
    try {
      const mediaType = hero.mediaType === "tv" ? "tv" : "movie";
      const res = await axios.get(requests.fetchVideos(mediaType, hero.id));
      const list = res.data?.results ?? [];

      const picked =
        list.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
        list.find((v) => v.site === "YouTube" && v.type === "Teaser") ||
        list.find((v) => v.site === "YouTube");

      setTrailerKey(picked?.key ?? null);
    } catch (e) {
      console.error(e);
      setTrailerKey(null);
    }
  };

  const handleCloseTrailer = () => setTrailerKey(null);

  return (
    <main style={{ background: "#000", minHeight: "100vh" }}>
      {/* HERO */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          minHeight: 700,
          color: "#fff",
          overflow: "hidden",
        }}
      >
        {/* backgound */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: hero.backdropUrl ? `url(${hero.backdropUrl})` : "",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: hero.backdropUrl ? undefined : "#111",
            transform: "scale(1.02)",
            filter: "brightness(0.9)",
          }}
        />

        {/* Shadow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%), linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)",
            zIndex: 1,
          }}
        />

        {/* trailer */}
        {trailerKey && (
          <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
            <iframe
              key={`${trailerKey}-${isMuted ? "m1" : "m0"}`}
              title="trailer"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${
                isMuted ? 1 : 0
              }&controls=0&playsinline=1&rel=0&modestbranding=1`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: 0 }}
            />

            <button
              onClick={handleCloseTrailer}
              style={{
                position: "absolute",
                top: 90,
                right: 30,
                zIndex: 3,
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "10px 14px",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              ✕ 닫기
            </button>
          </div>
        )}

        {/* Right Btn */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 410, 
            zIndex: 3,
          }}
        >
          <div style={{ maxWidth: 820 }}>
            <h1
              style={{
                fontSize: 96,
                fontWeight: 900,
                margin: 0,
                lineHeight: 0.95,
                letterSpacing: -2,
              }}
            >
              {hero.title}
            </h1>
          </div>

          <div
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            {/* Play Button */}
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <button
                onClick={handlePlay}
                style={{
                  padding: "12px 26px",
                  borderRadius: 6,
                  border: "none",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 18 }}>▶</span> 재생
              </button>

              <button
                onClick={() => setSelectedItem(hero)}
                style={{
                  padding: "12px 26px",
                  borderRadius: 6,
                  background: "rgba(109,109,110,0.7)",
                  color: "#fff",
                  border: "none",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.85)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 900,
                  }}
                >
                  i
                </span>
                상세 정보
              </button>
            </div>

            {/* Sound */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                aria-label="Volume"
                onClick={() => setIsMuted((v) => !v)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.6)",
                  background: "rgba(0,0,0,0.25)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <img
                  src="/image/Sound.png"
                  alt="sound"
                  style={{
                    width: 22,
                    height: 22,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 44,
                  padding: "0 14px",
                  background: "rgba(0,0,0,0.45)",
                  borderLeft: "4px solid rgba(255,255,255,0.75)",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 16,
                  letterSpacing: 0.5,
                }}
              >
                15
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROWS */}
      <section style={{ marginTop: -90, paddingBottom: 60 }}>
        {rows.map((row) => (
          <Row key={row.title}>
            <h2 style={{ color: "#fff", fontSize: 22, margin: "0 0 12px" }}>
              {row.title}
            </h2>

            <div className="rowList">
              {row.items.map((it) => (
                <div
                  key={`${it.mediaType}-${it.id}`}
                  className="card"
                  onClick={() => setSelectedItem(it)}
                  style={{ cursor: "pointer" }}
                  title={`${it.title} (${it.mediaType})`}
                >
                  {it.posterUrl ? (
                    <img src={it.posterUrl} alt={it.title} />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#aaa",
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Row>
        ))}
      </section>

      {/* MODAL */}
      <MovieModal
        open={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </main>
  );
}
