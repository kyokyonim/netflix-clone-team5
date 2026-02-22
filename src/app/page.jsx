"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useHomeFeed from "@/hooks/useHomeFeed";
import useHeroTrailer from "@/hooks/useHeroTrailer";
import Row from "@/components/Row";
import MovieModal from "@/components/MovieModal";

export default function Page() {
  const { hero, sections, loading, error } = useHomeFeed();

  // ✅ Trailer logic moved to hook (UI → hooks → api → mapper → TMDB)
  const { trailerKey, isMuted, setIsMuted, play, close } = useHeroTrailer(hero);

  // Modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (loading) {
    return (
      <main style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
        <div style={{ padding: 60, fontSize: 24 }}>Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
        <div style={{ padding: 60, fontSize: 24 }}>Error</div>
      </main>
    );
  }

  if (!hero || !sections?.length || !sections[0]?.items?.length) {
    return (
      <main style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
        <div style={{ padding: 60, fontSize: 24 }}>Empty</div>
      </main>
    );
  }

  return (
    <main style={{ background: "#000", minHeight: "100vh" }}>
      {/* HERO */}
      <section
        style={{
          position: "relative",
          height: isMobile ? "78vh" : "100vh",
          minHeight: isMobile ? 560 : 700,
          color: "#fff",
          overflow: "hidden",
        }}
      >
        {/* background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: hero.backdropUrl ? `url(${hero.backdropUrl})` : "",
            backgroundSize: "cover",
            backgroundPosition: isMobile ? "center top" : "center",
            backgroundColor: hero.backdropUrl ? undefined : "#111",
            transform: isMobile ? "scale(1)" : "scale(1.02)",
            filter: "brightness(0.9)",
          }}
        />

        {/* Shadow */}
        <div
          style={{
  
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
              onClick={close}
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
            left: "clamp(20px, 6vw, 60px)",
            right: "clamp(20px, 6vw, 60px)",
            top: isMobile ? "clamp(210px, 42vh, 290px)" : "clamp(280px, 45vh, 410px)",
            zIndex: 3,
          }}
        >
          <div style={{ maxWidth: "min(820px, 92vw)" }}>
            <h1
              style={{
                fontSize: "clamp(56px, 14vw, 96px)",
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
              marginTop: "clamp(14px, 3vw, 24px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "clamp(8px, 2vw, 16px)",
            }}
          >
            {/* Play Button */}
            <div
              style={{
                display: "flex",
                gap: "clamp(8px, 1.8vw, 14px)",
                alignItems: "center",
              }}
            >
              <button
                onClick={play}
                style={{
                  padding: "clamp(8px, 2.2vw, 12px) clamp(14px, 4vw, 26px)",
                  borderRadius: 6,
                  border: "none",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: "clamp(13px, 2.8vw, 16px)",
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(6px, 1.5vw, 10px)",
                  backgroundColor: "#ffffff",
                  color: "#000",
                }}
              >
                <span style={{ fontSize: "clamp(14px, 3.2vw, 18px)" }}>▶</span> 재생
              </button>

              <button
                onClick={() => setSelectedItem(hero)}
                style={{
                  padding: "clamp(8px, 2.2vw, 12px) clamp(14px, 4vw, 26px)",
                  borderRadius: 6,
                  background: "rgba(109,109,110,0.7)",
                  color: "#fff",
                  border: "none",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: "clamp(13px, 2.8vw, 16px)",
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(6px, 1.5vw, 10px)",
                }}
              >
                <span
                  style={{
                    width: "clamp(18px, 4vw, 22px)",
                    height: "clamp(18px, 4vw, 22px)",
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.85)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "clamp(11px, 2.8vw, 14px)",
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
                aria-label="Sound"
                onClick={() => setIsMuted((v) => !v)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  background: "transparent",
                }}
              >
                <Image
                  src="/image/Sound.png"
                  alt="sound"
                  width={22}
                  height={22}
                  style={{
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: 44,
                    padding: "0 14px",
                    background: "rgba(0,0,0,0.45)",
                    width: "100px",
                    borderLeft: "4px solid rgba(255,255,255,0.75)",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      background: "#d07a3a",
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: 18,
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    15
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROWS */}
      <section style={{ marginTop: isMobile ? -36 : -90, paddingBottom: 60 }}>
        {sections.map((row) => (
          <Row key={row.key ?? row.title}>
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
                    <Image src={it.posterUrl} alt={it.title} width={170} height={255} />
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
